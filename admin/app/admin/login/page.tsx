import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getSession } from "@/lib/auth";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  if (await getSession()) redirect("/admin");
  const query = await searchParams;

  return (
    <main className="relative grid min-h-dvh overflow-hidden bg-white p-4 sm:p-7 lg:p-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-[#e8f6fd] blur-3xl" />
        <div className="absolute -right-40 -bottom-44 size-[38rem] rounded-full bg-[#eef8fc] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 size-[28rem] -translate-1/2 rounded-full bg-[#f5fafc] blur-3xl" />
      </div>
      <div className="relative mx-auto grid w-full max-w-[1240px] self-center overflow-hidden rounded-[30px] border border-[#dce8ee] bg-white shadow-[0_30px_90px_rgba(1,47,73,.14)] lg:min-h-[620px] lg:grid-cols-[48%_52%]">
        <section className="relative flex min-h-[560px] flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_12%_8%,rgba(66,172,226,.24),transparent_34%),linear-gradient(145deg,#064361,#01273c_74%)] px-7 py-8 text-white sm:px-11 sm:py-10 lg:px-[clamp(3rem,4vw,4.25rem)] lg:py-12">
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/20 bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,.2)]">
              <img className="h-full w-full object-contain" src="/images/bgElevetorLogo.jpg" alt="BG Elevators" />
            </span>
            <div className="flex flex-col">
              <strong className="text-base leading-tight font-semibold tracking-[.01em] text-white">BG Elevators</strong>
              <small className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-[#72bde5]">ADMIN WORKSPACE</small>
            </div>
          </div>
          <div className="relative my-10 w-full max-w-[390px]">
            <span className="mb-4 block text-[10px] font-semibold tracking-[.2em] text-[#72c2e9]">SECURE OPERATIONS</span>
            <h2 className="m-0 text-[clamp(2.25rem,3.3vw,3.35rem)] leading-[1.06] font-semibold tracking-[-0.05em] text-white">
              Welcome to your <span className="block text-[#48abe0]">command centre.</span>
            </h2>
            <p className="mt-5 max-w-[350px] text-[14px] leading-[1.7] text-[#b0c9d6] sm:text-[15px]">One secure place to manage enquiries, applications, content and your team.</p>
          </div>
          <footer className="flex items-center gap-2 text-xs text-[#7899aa]">
            <span className="size-1.5 rounded-full bg-[#46b6ef] shadow-[0_0_12px_#46b6ef]" />
            BG Elevators · Administration
          </footer>
        </section>
        <section className="relative grid place-items-center overflow-hidden border-t border-[#e2ebf0] bg-[radial-gradient(circle_at_78%_12%,rgba(75,181,230,.17),transparent_32%),radial-gradient(circle_at_15%_88%,rgba(6,111,159,.08),transparent_36%),linear-gradient(145deg,#fff,#f5fafc)] px-6 py-10 sm:px-11 lg:border-t-0 lg:px-[clamp(3rem,5vw,5rem)]">
          <div className="pointer-events-none absolute top-[12%] right-[8%] size-28 rounded-full bg-[#8ed8fa]/15 blur-3xl" aria-hidden="true" />
          <LoginForm reset={Boolean(query.reset)} />
        </section>
      </div>
    </main>
  );
}
