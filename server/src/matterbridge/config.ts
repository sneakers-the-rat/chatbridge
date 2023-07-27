// @ts-nocheck
/*
Creating and synchronizing the .toml configuration files for matterbridge

 */

import {AppDataSource} from "../db/data-source";
import {Group} from "../entities/group.entity";
const slugify = require('slugify');
import * as TOML from '@ltd/j-toml';
const fs = require('fs');

const groupRepository = AppDataSource.getRepository(Group)



/*
[{protocol}.{name}]
  Token = {token}
  PrefixMessagesWithNick = true
  RemoteNickFormat = {RemoteNickFormat}
 */
type BridgeEntry = {
  protocol: string;
  name: string;
  Label: string;
  Token: string;
  PrefixMessagesWithNick: boolean;
  RemoteNickFormat: string
}

/*
[[gateway.inout]]
  account = {BridgeEntry.protocol}.{BridgeEntry.name}
  channel = {channel}
 */
type GatewayInOut = {
  account: string;
  channel: string;
}

/*
[[gateway]]
  name = {name}
  enable = {enable}
 */
type Gateway = {
  name: string;
  enable: boolean;
  bridges: BridgeEntry[];
  inOuts: GatewayInOut[];
}


export const getGroupConfig = async (group_name: string, group:object): Promise<Gateway> => {
  let group = await groupRepository.findOne({
    where: {name: group_name},
    relations: {channels: true}
  })

  // Construct config in the gateway style for programmatic use
  let gateway = <Gateway>{
    name: group.name,
    enable: group.enable,
    bridges: group.channels.map((channel) => {
      return {
        protocol: channel.bridge.Protocol,
        name: slugify(channel.bridge.Label),
        Label: channel.bridge.Label,
        Token: channel.bridge.Token,
        PrefixMessagesWithNick: channel.bridge.PrefixMessagesWithNick,
        RemoteNickFormat: channel.bridge.RemoteNickFormat
      }
    }),
    inOuts: group.channels.map((channel) => {
      return {
        account: `${channel.bridge.Protocol}.${slugify(channel.bridge.Label)}`,
        channel: channel.name
      }
    })
  }
  return gateway
}

/*
[slack.0]
        Token = ""
        PrefixMessagesWithNick = true
        RemoteNickFormat = "[{PROTOCOL}] <{NICK}> "

[slack.1]
        Token = ""
        PrefixMessagesWithNick = true
        RemoteNickFormat = "[{PROTOCOL}] <{NICK}> "

[[gateway]]
        name = "myGateway"
        enable = true

[[gateway.inout]]
        account = "slack.0"
        channel = "test"

[[gateway.inout]]
        account = "slack.1"
        channel = "test"


Becomes:

Object <[Object: null prototype] {}> {
  slack: Object <[Object: null prototype] {}> {
    '0': Object <[Object: null prototype] {}> {
      Token: '',
      PrefixMessagesWithNick: true,
      RemoteNickFormat: '[{PROTOCOL}] <{NICK}> '
    },
    '1': Object <[Object: null prototype] {}> {
      Token: '',
      PrefixMessagesWithNick: true,
      RemoteNickFormat: '[{PROTOCOL}] <{NICK}> '
    }
  },
  gateway: [
    Object <[Object: null prototype] {}> {
      name: 'myGateway',
      enable: true,
      inout: [Array]
    }
  ]
}
 */
export const GatewayToTOML = (gateway: Gateway) => {
  let protocols = {};
  // Each bridge is prefixed by the protocol as a TOML object, so
  // we have to do a sort of "groupBy" operation here
  // The TOML.Section calls are just for formatting when we write the file out
  // (ie. separate the different TOML table entries rather than representing them
  // inline. See https://www.npmjs.com/package/@ltd/j-toml
  gateway.bridges.forEach((bridge) => {

    let bridgeEntry = {
      Token: bridge.Token,
      PrefixMessagesWithNick: bridge.PrefixMessagesWithNick,
      RemoteNickFormat: bridge.RemoteNickFormat,
      Label: bridge.Label
    }

    if (!protocols.hasOwnProperty(bridge.protocol)){
      protocols[bridge.protocol] = {};
    }

    protocols[bridge.protocol][bridge.name] = TOML.Section(bridgeEntry)

  })
  console.log('protocols', protocols)

  return {
    ...protocols,
    'gateway': [TOML.Section({
      name: gateway.name,
      enable: gateway.enable,
      inout: gateway.inOuts.map((inout) => TOML.Section(inout))
    })]
  }
}

export const writeTOML = (gateway_toml: object, out_file: string) => {
  let toml_string = TOML.stringify(
    gateway_toml,
    {
      newline: '\n'
    }
  )

  fs.writeFileSync(out_file, toml_string)

}

export const writeGroupConfig = async (group_name: string, out_file: string) => {
  getGroupConfig(group_name)
    .then((group_config) => {
      writeTOML(GatewayToTOML(group_config), out_file)
    })
}




// const testGroup = {
//   name: 'testGroup',
//   enable: true,
//   channels: [
//     {
//       name: 'a-channel',
//       bridge: {
//         Protocol: 'slack',
//         Label:" My Lab",
//         Token: 'token',
//         PrefixMessagesWithNick: true,
//         RemoteNickFormat: 'hey'
//       }
//     },
//     {
//       name: 'b-channel',
//       bridge: {
//         Protocol: 'slack',
//         Label:" My Lab2",
//         Token: 'token',
//         PrefixMessagesWithNick: true,
//         RemoteNickFormat: 'hey'
//       }
//     }
//   ]
// }
//
// getGroupConfig('a', testGroup)
//   .then((res) => {
//     console.log('1', res);
//     console.log('toml', GatewayToTOML(res));
//     let toml_format = GatewayToTOML(res);
//     writeTOML(toml_format, 'test.toml')
//   })
