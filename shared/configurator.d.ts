export const defaultConfigurator: any;
export const statuses: string[];
export function enabledItems(items: any[]): any[];
export function initialConfiguration(config?: any): any;
export function calculateConfiguration(state: any, config?: any): any;
export function validateConfiguration(
  input: any,
  config?: any,
  technicalOnly?: boolean,
): any;
export function validateConfiguratorSettings(config: any): any;

export function resolveConfiguratorSettings(settings?: any): any;
