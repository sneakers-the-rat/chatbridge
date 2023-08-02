export interface slackChannel {
  id: string;
  name: string;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  is_mpim: boolean;
  is_private: boolean;
  created: number;
  is_archived: boolean;
  is_general: boolean;
  unlinked: number;
  name_normalized: string;
  is_shared: boolean;
  is_org_shared: boolean;
  is_pending_ext_shared: boolean;
  pending_shared: [];
  context_team_id: string;
  updated: number;
  creator: string;
  is_ext_shared: boolean;
  shared_team_ids: string[];
  is_member: boolean;
  num_members: number;
}

export interface authTest {
  ok: boolean;
  url: string;
  team: string;
  user: string;
  team_id: string;
  user_id: string;
  bot_id: string;
  is_enterprise_install: boolean;
}
