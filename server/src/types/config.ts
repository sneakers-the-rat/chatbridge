export interface slackConfigType {
  client_id: string,
  client_secret: string,
  signing_secret: string,
  state_secret: string
}

export interface discordConfigType {
  token: string;
  client_id: string;
}
