param(
  [Parameter(Mandatory = $true)]
  [string]$Path
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$w = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
$r = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

function Get-TextWithLinks {
  param($Node, $Namespaces, $Relationships)
  $parts = [System.Collections.Generic.List[string]]::new()
  foreach ($child in $Node.ChildNodes) {
    if ($child.LocalName -eq 'hyperlink') {
      $text = (($child.SelectNodes('.//w:t', $Namespaces) | ForEach-Object { $_.InnerText }) -join '')
      $id = $child.GetAttribute('id', $r)
      $target = $Relationships[$id]
      if ($target -and $target.StartsWith('https://www.bgelevators.com', [StringComparison]::OrdinalIgnoreCase)) {
        $target = ([Uri]$target).AbsolutePath -replace '\.html$', ''
        if (-not $target) { $target = '/' }
      }
      if ($target) { $parts.Add("[$text]($target)") } else { $parts.Add($text) }
    } elseif ($child.LocalName -eq 'r') {
      $parts.Add((($child.SelectNodes('.//w:t', $Namespaces) | ForEach-Object { $_.InnerText }) -join ''))
    } elseif ($child.LocalName -eq 'smartTag' -or $child.LocalName -eq 'sdt') {
      $parts.Add((($child.SelectNodes('.//w:t', $Namespaces) | ForEach-Object { $_.InnerText }) -join ''))
    }
  }
  return ($parts -join '').Trim()
}

$archive = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $Path))
try {
  $documentEntry = $archive.GetEntry('word/document.xml')
  $relationsEntry = $archive.GetEntry('word/_rels/document.xml.rels')
  if (-not $documentEntry -or -not $relationsEntry) { throw "Invalid DOCX package: $Path" }

  $reader = [IO.StreamReader]::new($documentEntry.Open())
  try { [xml]$document = $reader.ReadToEnd() } finally { $reader.Dispose() }
  $reader = [IO.StreamReader]::new($relationsEntry.Open())
  try { [xml]$relations = $reader.ReadToEnd() } finally { $reader.Dispose() }

  $namespaces = [System.Xml.XmlNamespaceManager]::new($document.NameTable)
  $namespaces.AddNamespace('w', $w)
  $relationships = @{}
  foreach ($relationship in $relations.Relationships.Relationship) {
    if ($relationship.Type -match '/hyperlink$') { $relationships[$relationship.Id] = [string]$relationship.Target }
  }

  $metadata = @{}
  $blocks = [System.Collections.Generic.List[string]]::new()
  $internalAlt = ''
  $title = ''
  $imageMarkerAdded = $false

  foreach ($node in $document.SelectNodes('//w:body/*', $namespaces)) {
    if ($node.LocalName -eq 'sectPr') { continue }
    if ($node.LocalName -eq 'tbl') {
      $rows = [System.Collections.Generic.List[object]]::new()
      foreach ($row in $node.SelectNodes('./w:tr', $namespaces)) {
        $cells = [System.Collections.Generic.List[string]]::new()
        foreach ($cell in $row.SelectNodes('./w:tc', $namespaces)) {
          $cellText = (($cell.SelectNodes('.//w:t', $namespaces) | ForEach-Object { $_.InnerText }) -join '').Trim()
          $cells.Add(($cellText -replace '\|', '\|'))
        }
        $rows.Add(@($cells))
      }
      if ($rows.Count -gt 0) {
        $blocks.Add('| ' + ($rows[0] -join ' | ') + ' |')
        $blocks.Add('| ' + (($rows[0] | ForEach-Object { '---' }) -join ' | ') + ' |')
        for ($rowIndex = 1; $rowIndex -lt $rows.Count; $rowIndex++) {
          $blocks.Add('| ' + ($rows[$rowIndex] -join ' | ') + ' |')
        }
        $blocks.Add('')
      }
      continue
    }

    $text = Get-TextWithLinks $node $namespaces $relationships
    $plain = (($node.SelectNodes('.//w:t', $namespaces) | ForEach-Object { $_.InnerText }) -join '').Trim()
    $styleNode = $node.SelectSingleNode('./w:pPr/w:pStyle', $namespaces)
    $style = if ($styleNode) { $styleNode.GetAttribute('val', $w) } else { '' }

    if ($plain -match '^Meta Title:\s*(.*)$') { $metadata.metaTitle = $Matches[1].Trim(); continue }
    if ($plain -match '^Meta Description:\s*(.*)$') { $metadata.metaDescription = $Matches[1].Trim(); continue }
    if ($plain -match '^URL:\s*(.*)$') { $metadata.sourceUrl = $Matches[1].Trim(); continue }
    if ($style -eq 'Title' -and -not $title) { $title = $plain; continue }
    if ($plain -match '^Alt text:\s*(.*)$') { $internalAlt = $Matches[1].Trim(); continue }

    if ($node.SelectSingleNode('.//w:drawing', $namespaces)) {
      if (-not $imageMarkerAdded) { $blocks.Add('[[INTERNAL_IMAGE]]'); $blocks.Add(''); $imageMarkerAdded = $true }
      continue
    }
    if (-not $text) { continue }

    if ($style -eq 'Heading2') { $blocks.Add("## $text"); $blocks.Add(''); continue }
    if ($style -eq 'Heading3') { $blocks.Add("### $text"); $blocks.Add(''); continue }
    if ($text -match '^•\s*(.+)$') { $blocks.Add("- $($Matches[1])"); continue }
    if ($text -match '^(\d+)\.\s*(.+)$') { $blocks.Add("$($Matches[1]). $($Matches[2])"); continue }
    $blocks.Add($text)
    $blocks.Add('')
  }

  $content = (($blocks -join "`n") -replace "(`r?`n){3,}", "`n`n").Trim()
  [pscustomobject]@{
    file = [IO.Path]::GetFileName($Path)
    title = $title
    metaTitle = $metadata.metaTitle
    metaDescription = $metadata.metaDescription
    sourceUrl = $metadata.sourceUrl
    internalImageAlt = $internalAlt
    internalImageMarkers = ([regex]::Matches($content, '\[\[INTERNAL_IMAGE\]\]')).Count
    content = $content
  } | ConvertTo-Json -Depth 8
} finally {
  $archive.Dispose()
}
