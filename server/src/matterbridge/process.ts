/*

Managing the matterbridge processes

*/

import {AppDataSource} from "../db/data-source";

const pm2 = require('pm2');
import config from "config";

import {GatewayToTOML, getGroupConfig, writeGroupConfig, writeTOML} from "./config";
import {Group} from "../entities/group.entity";
import slugify from "slugify";
import logger from "../logging";
const groupRepository = AppDataSource.getRepository(Group)


enum ProcessStatus {
  online = "online",
  stopping = "stopping",
  stopped = "stopped",
  launching = "launching",
  errored = "errored",
  one_launch_status = "one-launch-status"
}

type Process = {
  name: string;
  pid: number;
  pm_id: number;
  status: ProcessStatus;
  monit: {
    memory: number;
    cpu: number;
  }
  pm2_env: {
    created_at: number;
    exec_interpreter: string;
    exec_mode: string;
    instances: number;
    pm_out_log_path: string;
    pm_err_log_path: string;
    pm_pid_path: string;
  };

}

class MatterbridgeManager {

  private process_list: string[] = []
  constructor(
    private matterbridge_bin: string,
    private matterbridge_config_dir: string,
  ){}

  async spawnProcess(group_name: string) {
    let group_name_slug = slugify(group_name)
    let group_filename = `${this.matterbridge_config_dir}/matterbridge-${group_name_slug}.toml`
    let group_config = await getGroupConfig(group_name)
    if (group_config.inOuts.length === 0){
      logger.info(`Not spawning group ${group_name} with no bridged channels`)
      return
    }
    let res = writeTOML(GatewayToTOML(group_config), group_filename)
    if (res === false){
      logger.error('Not spawning, config could not be updated')
      return
    }

    await writeGroupConfig(group_name, group_filename);

    pm2.connect(async(err:any) => {
      if (!this.process_list.includes(group_name_slug)) {
        logger.info('Spawning new matterbridge process: %s', group_name_slug)
        await pm2.start(
            {
              name: group_name_slug,
              script: this.matterbridge_bin,
              args: `-conf ${group_filename}`,
              interpreter: 'none'
            },
            (err: any, apps: object) => {
              if (err) {
                logger.error('error starting matterbridge process', err, apps)
              }
            }
        )
        this.process_list.push(group_name_slug)
      } else {
        logger.info('Restarting existing matterbridge process: %s', group_name_slug)
        await pm2.restart(group_name_slug, (err: any, proc: any) => {
              if (err) {
                logger.error('error restarting matterbridge process', err)
              }
            }
        )
      }
      // await pm2.disconnect()
    })
  }

  async refreshConfig(group_name: string) {
    let group_name_slug = slugify(group_name)
    let group_filename = `${this.matterbridge_config_dir}/matterbridge-${group_name_slug}.toml`
    await writeGroupConfig(group_name, group_filename);
  }

  async spawnAll(){
    let groups = await groupRepository.find({
      select: {name: true}
    })
    groups.map(
      (group) => this.spawnProcess(group.name)
    )
  }

  get processes(): Promise<Process[]> {
    return new Promise((resolve, reject) => {
    pm2.list((err:any, list:[]) => {
      if (err) reject(err);
      else resolve(list.map((proc:any) => {
          return <Process>{
            name: proc.name,
            pid: proc.pid,
            pm_id: proc.pm2_env.pm_id,
            status: proc.pm2_env.status,
            monit: proc.monit,
            pm2_env: {
              created_at: proc.pm2_env.created_at,
              exec_interpreter: proc.pm2_env.exec_interpreter,
              exec_mode: proc.pm2_env.exec_mode,
              instances: proc.pm2_env.instances,
              pm_out_log_path: proc.pm2_env.pm_out_log_path,
              pm_err_log_path: proc.pm2_env.pm_err_log_path,
              pm_pid_path: proc.pm2_env.pm_pid_path,
            }
          }
        }))
      })})
  }

}

const matterbridge_config = config.get<{bin:string, config:string}>('matterbridge')

const manager = new MatterbridgeManager(
  matterbridge_config.bin,
  matterbridge_config.config
)

export const killMatterbridge = () => {
  pm2.connect((err: Error|undefined) => {
    if (err){
      logger.error('error connecting to pm2', err)
    }
    pm2.killDaemon((err: Error|undefined) => {
      if (err){
        logger.error('error killing pm2 daemon', err)
      }
      pm2.disconnect()
    })
  })
}

export default manager
