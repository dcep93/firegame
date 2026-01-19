// Extracted from public_catann/catann_files/shared.a1f7aa47ccdd213a17fe.js

export enum SocketRouteType {
  RouteToServerType = 2,
  RouteToServerDirect = 3,
  SocketRouter = 4,
}

export enum State {
  GameStateUpdate = 130,
  MatchmakingStateUpdate = 131,
  LobbyStateUpdate = 133,
  ChannelStateUpdate = 134,
  GeneralStateUpdate = 135,
  SocketMonitorUpdate = 136,
  RoomEvent = 137,
  ShuffleStateUpdate = 139,
}

export enum ServerActionType {
  GameAction = 1,
  LobbyAction = 2,
  RoomAction = 3,
  MatchmakingAction = 4,
  ChannelAction = 5,
  Noop = 6,
  GeneralAction = 7,
  Echo = 8,
  CloseSocket = 9,
  RoomCommand = 10,
  ShuffleAction = 11,
}

export enum LobbyAction {
  ClickedBotGame = 2,
  ClickedCreateRoom = 3,
  ClickedJoinRoom = 4,
  AccessGameLink = 5,
  ClickedSpectateGame = 6,
  ReconnectGame = 7,
  SaveClientReferrer = 8,
  SetAdBlockStatus = 9,
  InteractedWithSite = 10,
  ClickedStartBeginnerMode = 11,
  Clicked1v1BeginnerBotGame = 12,
  ClickedEasyBotGame = 13,
  WatchRoomList = 14,
  StopWatchingRoomList = 15,
  AutoRejoinGame = 16,
}

export enum LobbyState {
  AutoRejoinGame = 1,
  SessionState = 2,
  UserStateUpdate = 3,
  LobbyDisconnectData = 4,
  SendPopup = 5,
  ShowCornerPopup = 6,
  SendBroadcast = 7,
  SocketTest = 8,
  ServerUpdating = 9,
  ReloadClient = 10,
  ServerUpdated = 11,
  RoomListUpdate = 12,
}

export enum ChannelAction {
  ChannelJoin = 1,
  ChannelJoinRoomOrGame = 2,
}

export enum MatchmakingAction {
  ClickedFindGame = 1,
  ClickedCancelFindGame = 2,
}

export enum GeneralAction {
  RegisterToFriendService = 1,
  ChangeOnlineStatus = 2,
  GetAllFriendsOnlineStatus = 3,
  InviteFriendToRoom = 4,
  GetAllRoomInvitesReceived = 5,
  RespondToFriendRoomInvite = 6,
  GetNotifications = 7,
  MarkNotificationAsRead = 8,
  MarkAllNotificationsAsRead = 9,
  RegisterToNotificationService = 10,
}

export enum OnlineStatus {
  Offline = 0,
  OnlineAndIdle = 1,
  InRoom = 2,
  InGame = 3,
}

export enum RoomCreationType {
  Standard = 0,
  FreeMap = 1,
  BeginnerMode = 2,
  CustomLink = 3,
  DiscordActivity = 4,
  Tournament = 5,
}

export enum RoomSettingEditType {
  EditSettings = 0,
  SeedOrderSelection = 1,
  PlayOrderSelection = 2,
}

export enum ShuffleQueueAction {
  GetShuffleQueueData = 1,
}

export enum DiscordActivityCommand {
  ContentFrameReady = "content-frame-ready",
  Subscribe = "subscribe",
  Unsubscribe = "unsubscribe",
  SetActivity = "set-activity",
  DispatchDiscordEvent = "dispatch",
  OpenExternalLink = "open-external-link",
  InviteFriends = "invite-friends",
  Purchase = "purchase",
  ShareMoment = "share-moment",
  ShareActivityLink = "share-activity-link",
  SetOrientation = "set-orientation",
}

export enum DiscordActivityEvent {
  Ready = "ready",
  CreateMountPopup = "create-mount-popup",
}

export enum DiscordActivityError {
  UserAlreadyHasMembershipError = "user-already-has-membership-error",
}

export enum DiscordActivityPurchaseAction {
  PurchaseMembership = 0,
  PurchaseGift = 1,
  PurchaseCoins = 2,
  InviteFriends = 3,
  ShareMoment = 4,
  OpenExternalLink = 5,
  ShareActivityLink = 6,
}

export enum NotificationType {
  UserReportedBanned = 1,
  UserReportedThankYou = 2,
  HolidaySale2023Expired = 3,
  GiftMembershipReceivedFromAdmin = 4,
  TranslationHelp = 5,
  UserReportedWarning = 6,
  LiveRoomInvite = 7,
  RoomInviteResponse = 8,
  MissedRoomInvite = 9,
  FriendRequestReceived = 10,
  YouAreNowFriendsWith = 11,
  GiftMembershipReceivedFromUser = 12,
  GiftMembershipWasSent = 13,
  GiftURLCreated = 14,
  NewUserJoinedFromReferral = 15,
  ReferralRewardItemUnlocked = 16,
  YouAreBanned = 17,
  FreeAvatarUnlocked = 18,
  PushReferrersToInviteMoreFriends = 19,
  GeneralAnnouncement = 20,
}

export enum RankTier {
  Grandmaster = 0,
  Master = 1,
  Diamond = 2,
  Platinum = 3,
  Gold = 4,
  Silver = 5,
  Bronze = 6,
  None = 7,
}

export enum RankDivision {
  None = 0,
  I = 1,
  II = 2,
  III = 3,
  IV = 4,
  V = 5,
}

export enum RankStatus {
  Placement = 0,
  Ranked = 1,
  RankedLocked = 2,
}

export enum ProfileTab {
  Overview = 0,
  Ranked = 1,
  History = 2,
  Items = 3,
}

export enum PlayerOptionsAction {
  Report = 0,
  Mute = 1,
  Profile = 2,
  AddFriend = 3,
  BlockTrades = 4,
  Gift = 5,
}

export enum RoomWarningType {
  StartGameVPExceededRecommendedLimit = 0,
  ReadyUpVPExceededRecommendedLimit = 1,
}

export enum ToastType {
  Information = 0,
  Success = 1,
  Warning = 2,
  Error = 3,
  SocketError = 4,
  Reconnect = 5,
}

export enum MatchmakingCategory {
  Bots = 0,
  Casual = 1,
  Ranked = 2,
}

export enum SettingsTab {
  General = 0,
  Volume = 1,
}

export enum AnalyticsPage {
  Leaderboard = 0,
  Lobby = 1,
  Homepage = 2,
  Store = 3,
  Profile = 4,
  Game = 5,
}

export enum LogSeverity {
  JL1 = 0,
  JL2 = 1,
  JL3 = 2,
  JL4 = 3,
  JL5 = 4,
}

export enum MembershipType {
  PlusMonthly = 0,
  PremiumMonthly = 1,
  EliteMonthly = 2,
  PlusYearly = 3,
  PremiumYearly = 4,
  EliteYearly = 5,
  Holiday2023AllAccessPass = 6,
}

export enum GiftMembershipType {
  Holiday2023AllAccessPass = 0,
  GiftPlusMonthly = 1,
  GiftPremiumMonthly = 2,
  GiftEliteMonthly = 3,
  GiftPlusYearly = 4,
  GiftPremiumYearly = 5,
  GiftEliteYearly = 6,
}

export enum ExpansionType {
  Seafarers4P = 0,
  CitiesAndKnights4P = 1,
  TradersAndBarbarians = 2,
  ExplorersAndPirates = 3,
  Classic56P = 4,
  Classic78P = 5,
  Seafarers56P = 6,
  CitiesAndKnights56P = 7,
  CitiesAndKnightsSeafarers4P = 8,
  CitiesAndKnightsSeafarers56P = 9,
}

export enum GameType {
  Unknown = 0,
  Tutorial = 1,
  BotGame = 2,
  CreatedRoomGame = 3,
  MatchmakingGame = 5,
  MatchmakingGameRanked = 6,
  BeginnerMode = 7,
  CreatedTournamentRoom = 8,
}

export enum GameModeId {
  Classic4P = 0,
  TutorialClassic4P = 1,
  Classic56P = 2,
  Classic78P = 3,
  Seafarers4P = 4,
  Seafarers56P = 5,
  CitiesAndKnights4P = 6,
  CitiesAndKnights56P = 7,
  CitiesAndKnightsSeafarers4P = 8,
  CitiesAndKnightsSeafarers56P = 9,
  ServerStressTestClassic4P = 10,
  BeginnerModeClassic4P = 11,
  ColonistRush4P = 12,
}

export enum MapId {
  Classic4P = 0,
  TutorialClassic4P = 1,
  Classic4PRandom = 2,
  Classic56P = 3,
  Classic78P = 4,
  SS1HeadingForNewShores3P = 5,
  SS1HeadingForNewShores4P = 6,
  SS1HeadingForNewShores56P = 7,
  TutorialSS1HeadingForNewShores4P = 8,
  SS2FourIslands3P = 9,
  SS2FourIslands4P = 10,
  SS2SixIslands56P = 11,
  TutorialSS2FourIslands4P = 12,
  SS3FogIslands3P = 13,
  SS3FogIslands4P = 14,
  SS3FogIslands56P = 15,
  TutorialSS3FogIsland4P = 16,
  SS4ThroughTheDesert3P = 17,
  SS4ThroughTheDesert4P = 18,
  SS4ThroughTheDesert56P = 19,
  TutorialSS4ThroughTheDesert4P = 20,
  KingOfTheHill = 21,
  Earth = 22,
  EarthSeafarers = 23,
  USA = 24,
  UK = 25,
  UKSeafarers = 26,
  Diamond = 27,
  Gear = 28,
  Lakes = 29,
  Pond = 30,
  Twirl = 31,
  ShuffleBoard = 32,
  BlackForest = 33,
  Volcano = 34,
  Circle = 35,
  Kite = 36,
  Romania = 37,
  MiniBase = 38,
  Monopoly = 39,
  MountainOfRiches = 40,
  Doggo = 41,
  Duel = 42,
  TradeIslands = 43,
  TradeIslandsSeafarers = 44,
  Vietnam = 45,
  TurningTidesSeafarers = 46,
  TurningTidesClassic = 47,
  TwoIsles = 48,
  JellyFish = 49,
  GoldRush = 50,
  Istanbul = 51,
  IstanbulSeafarers = 52,
  Europe = 53,
  EuropeSeafarers = 54,
  Stripes = 55,
  MonopolyIslands = 56,
  MonopolyIslandsSeafarers = 57,
  CampaignLevel1 = 58,
  CampaignLevel2 = 59,
  CampaignRoadRace = 60,
  CampaignRoadRace2 = 61,
}

export enum TurnTimerType {
  Base30s = 0,
  Base60s = 1,
  Base120s = 2,
  Base240s = 3,
  Base12000s = 4,
  Rush5s = 5,
  Rush8s = 6,
  Rush10s = 7,
  Rush15s = 8,
  Rush20s = 9,
}

export enum QueueVisibility {
  Inactive = 0,
  HiddenUnranked1v1 = 1,
  HiddenUnranked4PClassic = 2,
  VisibleRanked1v1 = 3,
  VisibleRanked4PClassic = 4,
  VisibleRankedCitiesAndKnights4P = 5,
  HiddenUnrankedShuffle = 6,
}

export enum PlayerCountMode {
  Players4 = 0,
  Players56 = 1,
  Players78 = 2,
}

export enum SeafarersScenarioId {
  None = 0,
  SS1HeadingForNewShores = 1,
  SS2TheFourIslands = 2,
  SS3TheFogIslands = 3,
  SS4ThroughTheDesert = 4,
}

export enum DiceDistributionType {
  Random = 0,
  Balanced = 1,
  StressTestSequence = 2,
  PredefinedDiceSequenceDeleted = 3,
}

export enum AnimationSpeed {
  Fast = 0,
  Normal = 1,
  Slow = 2,
}

export enum UserRole {
  Administrator = 0,
  User = 1,
  Manager = 4,
  Moderator = 5,
}

export enum PlatformType {
  Unknown = 0,
  Web = 1,
  Discord = 2,
  AppleWeb = 3,
  AppleApp = 4,
  AndroidWeb = 5,
  AndroidApp = 6,
  MobileUnknown = 7,
  DiscordMobile = 8,
}
