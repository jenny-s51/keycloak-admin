const expect = chai.expect;
export default class RealmSettingsPage {
  generalSaveBtn = "general-tab-save";
  themesSaveBtn = "themes-tab-save";
  loginTab = "rs-login-tab";
  selectLoginTheme = "#kc-login-theme";
  loginThemeList = "#kc-login-theme + ul";
  selectAccountTheme = "#kc-account-theme";
  accountThemeList = "#kc-account-theme + ul";
  selectAdminTheme = "#kc-admin-console-theme";
  adminThemeList = "#kc-admin-console-theme + ul";
  selectEmailTheme = "#kc-email-theme";
  emailThemeList = "#kc-email-theme + ul";
  hostInput = "#kc-host";
  ssoSessionIdleSelectMenu = "#kc-sso-session-idle-select-menu";
  ssoSessionIdleSelectMenuList = "#kc-sso-session-idle-select-menu > div > ul";
  ssoSessionMaxSelectMenu = "#kc-sso-session-max-select-menu";
  ssoSessionMaxSelectMenuList = "#kc-sso-session-max-select-menu > div > ul";

  ssoSessionMaxRememberMeSelectMenu =
    "#kc-sso-session-max-remember-me-select-menu";
  ssoSessionMaxRememberMeSelectMenuList =
    "#kc-sso-session-max-remember-me-select-menu > div > ul";

  ssoSessionIdleRememberMeSelectMenu =
    "#kc-sso-session-idle-remember-me-select-menu";
  ssoSessionIdleRememberMeSelectMenuList =
    "#kc-sso-session-idle-remember-me-select-menu > div > ul";

  clientSessionIdleSelectMenu = "#kc-client-session-idle-select-menu";
  clientSessionIdleSelectMenuList =
    "#kc-client-session-idle-select-menu > div > ul";

  clientSessionMaxSelectMenu = "#kc-client-session-max-select-menu";
  clientSessionMaxSelectMenuList =
    "#kc-client-session-max-select-menu > div > ul";

  offlineSessionIdleSelectMenu = "#kc-offline-session-idle-select-menu";

  loginTimeoutSelectMenu = "#kc-login-timeout-select-menu";
  loginTimeoutSelectMenuList = "#kc-login-timeout-select-menu > div > ul";

  loginActionTimeoutSelectMenu = "#kc-login-action-timeout-select-menu";
  loginActionTimeoutSelectMenuList =
    "#kc-login-action-timeout-select-menu > div > ul";

  selectDefaultLocale = "select-default-locale";
  defaultLocaleList = "select-default-locale > div > ul";
  emailSaveBtn = "email-tab-save";
  managedAccessSwitch = "user-managed-access-switch";
  userRegSwitch = "user-reg-switch";
  forgotPwdSwitch = "forgot-pw-switch";
  rememberMeSwitch = "remember-me-switch";
  emailAsUsernameSwitch = "email-as-username-switch";
  loginWithEmailSwitch = "login-with-email-switch";
  duplicateEmailsSwitch = "duplicate-emails-switch";
  verifyEmailSwitch = "verify-email-switch";
  authSwitch = "email-authentication-switch";
  fromInput = "sender-email-address";
  enableSslCheck = "enable-ssl";
  enableStartTlsCheck = "enable-start-tls";
  addProviderDropdown = "addProviderDropdown";
  addProviderButton = "add-provider-button";
  displayName = "display-name-input";
  enableEvents = "eventsEnabled";
  eventsUserSave = "save-user";
  eventTypeColumn = 'tbody > tr > [data-label="Event saved type"]';
  filterSelectMenu = ".kc-filter-type-select";
  passiveKeysOption = "passive-keys-option";
  disabledKeysOption = "disabled-keys-option";
  testConnectionButton = "test-connection-button";
  modalTestConnectionButton = "modal-test-connection-button";
  emailAddressInput = "email-address-input";
  addBundleButton = "no-message-bundles-empty-action";
  confirmAddBundle = "add-bundle-confirm-button";
  keyInput = "key-input";
  valueInput = "value-input";
  deleteAction = "delete-action";
  modalConfirm = "modalConfirm";
  ssoSessionIdleInput = "sso-session-idle-input";
  ssoSessionMaxInput = "sso-session-max-input";
  ssoSessionIdleRememberMeInput = "sso-session-idle-remember-me-input";
  ssoSessionMaxRememberMeInput = "sso-session-max-remember-me-input";
  clientSessionIdleInput = "client-session-idle-input";
  clientSessionMaxInput = "client-session-max-input";
  offlineSessionIdleInput = "offline-session-idle-input";
  offlineSessionMaxSwitch = "offline-session-max-switch";
  loginTimeoutInput = "login-timeout-input";
  loginActionTimeoutInput = "login-action-timeout-input";

  selectLoginThemeType(themeType: string) {
    cy.get(this.selectLoginTheme).click();
    cy.get(this.loginThemeList).contains(themeType).click();

    return this;
  }

  selectAccountThemeType(themeType: string) {
    cy.get(this.selectAccountTheme).click();
    cy.get(this.accountThemeList).contains(themeType).click();
    return this;
  }

  selectAdminThemeType(themeType: string) {
    cy.get(this.selectAdminTheme).click();
    cy.get(this.adminThemeList).contains(themeType).click();
    return this;
  }

  selectEmailThemeType(themeType: string) {
    cy.get(this.selectEmailTheme).click();
    cy.get(this.emailThemeList).contains(themeType).click();
    return this;
  }

  fillEmailField(email: string) {
    cy.getId(this.emailAddressInput).type(email);
    return this;
  }

  fillHostField(host: string) {
    cy.get(this.hostInput).clear().type(host);
    return this;
  }

  setDefaultLocale(locale: string) {
    cy.get(this.selectDefaultLocale).click();
    cy.get(this.defaultLocaleList).contains(locale).click();
    return this;
  }

  saveGeneral() {
    cy.getId(this.generalSaveBtn).click();

    return this;
  }

  saveThemes() {
    cy.getId(this.themesSaveBtn).click();

    return this;
  }

  addSenderEmail(senderEmail: string) {
    cy.getId(this.fromInput).clear();

    if (senderEmail) {
      cy.getId(this.fromInput).type(senderEmail);
    }

    return this;
  }

  testSelectFilter() {
    cy.get(this.filterSelectMenu).first().click();
    cy.getId(this.passiveKeysOption).click();
    cy.get(this.filterSelectMenu).first().click();
    cy.getId(this.disabledKeysOption).click();
  }

  toggleSwitch(switchName: string) {
    cy.getId(switchName).click({ force: true });

    return this;
  }

  toggleCheck(switchName: string) {
    cy.getId(switchName).click();

    return this;
  }

  toggleAddProviderDropdown() {
    const keysUrl = "/auth/admin/realms/master/keys";
    cy.intercept(keysUrl).as("keysFetch");
    cy.getId(this.addProviderDropdown).click();

    return this;
  }

  addProvider() {
    cy.getId(this.addProviderButton).click();

    return this;
  }

  addKeyValuePair(key: string, value: string) {
    cy.getId(this.addBundleButton).click();

    cy.getId(this.keyInput).type(key);
    cy.getId(this.valueInput).type(value);

    cy.getId(this.confirmAddBundle).click();

    return this;
  }

  deleteProvider(providerName: string) {
    cy.getId("provider-name-link")
      .contains(providerName)
      .parent()
      .siblings(".pf-c-data-list__item-action")
      .click()
      .getId(this.deleteAction)
      .click();
    cy.wait(500).getId(this.modalConfirm).click();
  }

  enterConsoleDisplayName(name: string) {
    cy.getId(this.displayName).clear().type(name);
  }

  save(saveBtn: string) {
    cy.getId(saveBtn).click();

    return this;
  }

  clearEvents(type: "admin" | "user") {
    cy.getId(`clear-${type}-events`).click();

    return this;
  }

  addUserEvents(events: string[]) {
    cy.getId("addTypes").click();
    for (const event of events) {
      cy.get(this.eventTypeColumn)
        .contains(event)
        .parent()
        .find("input")
        .click();
    }
    return this;
  }

  changeTimeUnit(
    unit: "Minutes" | "Hours" | "Days",
    inputType: string,
    listType: string
  ) {
    switch (unit) {
      case "Minutes":
        cy.get(inputType).click();
        cy.get(listType).contains(unit).click();
        break;
      case "Hours":
        cy.get(inputType).click();
        cy.get(listType).contains(unit).click();
        break;
      case "Days":
        cy.get(inputType).click();
        cy.get(listType).contains(unit).click();
        break;
      default:
        throw "Invalid unit, must be 'minutes', 'hours', or 'days'.";
    }
    return this;
  }

  populateSessionsPage() {
    cy.getId(this.ssoSessionIdleInput).clear().type("1");
    this.changeTimeUnit(
      "Minutes",
      this.ssoSessionIdleSelectMenu,
      this.ssoSessionIdleSelectMenuList
    );
    cy.getId(this.ssoSessionMaxInput).clear().type("2");
    this.changeTimeUnit(
      "Hours",
      this.ssoSessionMaxSelectMenu,
      this.ssoSessionMaxSelectMenuList
    );
    cy.getId(this.ssoSessionIdleRememberMeInput).clear().type("3");
    this.changeTimeUnit(
      "Days",
      this.ssoSessionIdleRememberMeSelectMenu,
      this.ssoSessionIdleRememberMeSelectMenuList
    );
    cy.getId(this.ssoSessionMaxRememberMeInput).clear().type("4");
    this.changeTimeUnit(
      "Minutes",
      this.ssoSessionMaxRememberMeSelectMenu,
      this.ssoSessionMaxRememberMeSelectMenuList
    );

    cy.getId(this.clientSessionIdleInput).clear().type("5");
    this.changeTimeUnit(
      "Hours",
      this.clientSessionIdleSelectMenu,
      this.clientSessionIdleSelectMenuList
    );
    cy.getId(this.clientSessionMaxInput).clear().type("6");
    this.changeTimeUnit(
      "Days",
      this.clientSessionMaxSelectMenu,
      this.clientSessionMaxSelectMenuList
    );

    cy.getId(this.offlineSessionIdleInput).clear().type("7");
    this.toggleSwitch(this.offlineSessionMaxSwitch);

    cy.getId(this.loginTimeoutInput).clear().type("9");
    this.changeTimeUnit(
      "Minutes",
      this.loginTimeoutSelectMenu,
      this.loginTimeoutSelectMenuList
    );
    cy.getId(this.loginActionTimeoutInput).clear().type("10");
    this.changeTimeUnit(
      "Days",
      this.loginActionTimeoutSelectMenu,
      this.loginActionTimeoutSelectMenuList
    );
  }

  checkUserEvents(events: string[]) {
    cy.get(this.eventTypeColumn).should((event) => {
      for (const user of events) {
        expect(event).to.contain(user);
      }
    });
    return this;
  }

  clickAdd() {
    cy.getId("addEventTypeConfirm").click();
    return this;
  }
}
