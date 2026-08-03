import { CronJob } from "cron";
import { clearImagesCache } from "./jobs/clearImagesCache";
import { Logger } from "../utils/Logger";

interface JobEntry {
  job: CronJob;
  interval: string;
}

class CronService {
  private jobs: { [key: string]: JobEntry } = {};

  constructor() {
    // Register default jobs
    this.addJob("clearCache", "0 * * * *", () => clearImagesCache());
  }

  addJob(
    name: string,
    interval: string,
    callback: () => void,
    timeZone: string = "Europe/Paris",
  ): void {
    const job = new CronJob(interval, callback, null, false, timeZone);
    this.jobs[name] = { job, interval };
  }

  removeJob(name: string): boolean {
    const jobEntry = this.jobs[name];
    if (jobEntry) {
      jobEntry.job.stop();
      delete this.jobs[name];
      return true;
    }
    return false;
  }

  startJob(name: string): boolean {
    const jobEntry = this.jobs[name];
    if (jobEntry) {
      jobEntry.job.start();
      return true;
    }
    return false;
  }

  stopJob(name: string): boolean {
    const jobEntry = this.jobs[name];
    if (jobEntry) {
      jobEntry.job.stop();
      return true;
    }
    return false;
  }

  startAll(): void {
    const jobNames = Object.keys(this.jobs);
    for (let i = 0; i < jobNames.length; i++) {
      this.jobs[jobNames[i]].job.start();
    }
    Logger.info("cron", "Cron jobs initialized");
  }

  stopAll(): void {
    const jobNames = Object.keys(this.jobs);
    for (let i = 0; i < jobNames.length; i++) {
      this.jobs[jobNames[i]].job.stop();
    }
    Logger.info("cron", "Cron jobs stopped");
  }

  async runManually(name: string): Promise<boolean> {
    const jobEntry = this.jobs[name];
    if (jobEntry) {
      // Get the callback from the job and run it
      await jobEntry.job.fireOnTick();
      return true;
    }
    return false;
  }

  getJobStatus(name: string): boolean {
    const jobEntry = this.jobs[name];
    return jobEntry ? jobEntry.job.isCallbackRunning : false;
  }

  listJobs(): string[] {
    return Object.keys(this.jobs);
  }
}

export const Cron = new CronService();
