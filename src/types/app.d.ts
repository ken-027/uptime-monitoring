export interface AgentResponse {
  status: AppStatus;
  siteType: string;
  techs: string[];
  seoIssue: string;
  brokenLink: string;
  performance: string;
  security: string;
  description: string;
  responseTime: number;
}
