class MessageResource {
  // 基本的には、初期化済みプロパティでメッセージを作る。
  PAGE_NOT_FOUND = "404 page not found";
  INVALID_TOKEN = "Invalid token.";
  SOMETHING_BROKEN =
    "Something broken! このエラーは操作ミスではなくバグの可能性があります。";
  NO_JWT_TOKEN = "No JWT token provided. or unmatched path ";
  NO_DATA = "データがありませんでした。";

  // ログイン関連
  NOT_REGISTED_USER =
    "登録されていないユーザーです。アカウント登録してください";
  NOT_REGISTED_MAIL =
    "登録されていないメールアドレスです。アカウント登録してください";
  NOT_MATCHED_PASS = "メールアドレスまたはパスワードが間違っています";
  NOT_MATCHED_TYPE = "ログインしようとしているログイン画面が違っています。";

  // 既に登録されている
  ALREADY_INSERTED = "すでに登録されています。";

  AUTH_SUCCESSFULLY_FINISHED = "ログインに成功しました。";
  DUPLICATE_EMAIL =
    "すでに登録済のメールアドレスです。ログインページへお進みください。";

  // メール送信
  REQUIRE_TO_MAIL_ADDRESS = "宛先のメールアドレスが指定されていません";

  // バッチ起動のメッセージ
  START_NOTIFY_REMINDER = `${new Date()}リマインド通知処理を実行します。`;
  END_NOTIFY_REMINDER = `${new Date()}のリマインド通知処理を終了します。`;

  ////////
  // コンピューテッド
  // 動的項目が必要なメッセージは、コンピューテッドプロパティで作る
  ////////
  get REQUIRE_PASSWORD() {
    return this.REQUIRE_SOMETHING("パスワード");
  }
  get REQUIRE_USER_ID() {
    return this.REQUIRE_SOMETHING("ユーザーID");
  }
  get REQUIRE_MAIL() {
    return this.REQUIRE_SOMETHING("メールアドレス");
  }
  ////////
  // 関数
  ////////
  // このクラス内では、関数はプライベートのみ許す。プロパティでアクセスさせるため。
  // 必須入力の関数
  private REQUIRE_SOMETHING(name: string) {
    return `${name}は必須入力です`;
  }
}

export const messageResource = new MessageResource();
