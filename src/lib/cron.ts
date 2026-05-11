// 定时任务配置和状态管理
interface CronJobConfig {
  id: string;
  name: string;
  schedule: string; // cron表达式
  enabled: boolean;
  lastRun: string | null;
  nextRun: string | null;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

// 内存中的任务状态（生产环境应使用数据库）
let cronJobs: CronJobConfig[] = [
  {
    id: 'fetch-blogger-reviews',
    name: 'Fetch Blogger Reviews',
    schedule: '0 */6 * * *', // 每6小时
    enabled: true,
    lastRun: null,
    nextRun: null,
    status: 'idle',
  },
  {
    id: 'fetch-tool-data',
    name: 'Fetch Tool Data',
    schedule: '0 0 * * *', // 每天午夜
    enabled: true,
    lastRun: null,
    nextRun: null,
    status: 'idle',
  },
];

// 获取所有定时任务
export function getCronJobs(): CronJobConfig[] {
  return cronJobs;
}

// 更新任务状态
export function updateJobStatus(jobId: string, status: CronJobConfig['status']) {
  const job = cronJobs.find(j => j.id === jobId);
  if (job) {
    job.status = status;
    if (status === 'completed' || status === 'failed') {
      job.lastRun = new Date().toISOString();
    }
  }
}

// 添加新任务
export function addCronJob(job: CronJobConfig) {
  cronJobs.push(job);
}

// 删除任务
export function removeCronJob(jobId: string) {
  cronJobs = cronJobs.filter(j => j.id !== jobId);
}

// 启用/禁用任务
export function toggleCronJob(jobId: string, enabled: boolean) {
  const job = cronJobs.find(j => j.id === jobId);
  if (job) {
    job.enabled = enabled;
  }
}

export type { CronJobConfig };
