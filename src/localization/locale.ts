/* tslint:disable:object-literal-key-quotes */

export type Location = "us" | "jp";

export type LocationText = (
    "Name" | "Display name" | "Mail address" | "Career" | "Message" |"Skill" | "Input skill" | "Save" | "Cancel" | "Submit" | "Select avatar image" |
    "Upload avatar" |"Title" | "Input title" | "Tags" | "Description" | "Input description" | "Image" | "Preview" | "Create" | "Update" | "Publish" |
    "Profile" | "Work list" | "Works" | "Designer" | "Popular" | "New" | "Languages" | "Language" | "Settings" | "Sign in" | "Sign out" | "Password" |
    "Create account" | "location" | "Initial registration profile" | "Input tags" | "User list" | "Work post" | "Work update" | "New mail address" |
    "Credential" | "Update a credential email" | "Update password" | "New password" | "Old password" | "Not Found" | "Bold" | "Heading" | "Italic" |
    "Numbered list" | "Generic list" | "Insert horizontal line" | "Create link" | "Quote" | "Code" | "Insert table" | "Strikethrough" | "Public mail address" |
    "Toggle password visibility" | "Error" | "User" | "How to use Markdown" | "Hint" | "Font style" | "Decoration" | "Table" | "List" | "Popular tags" |
    "Please enter using capital and small letters which are combined and more than 8 letters"
);

export type LocationTextList = { [key in LocationText]: string };

const locationTextList:{ [key in Location]: LocationTextList } = {
    us: {
        "Name": "Name",
        "Display name": "Display name",
        "Mail address": "Mail address",
        "Career": "Career",
        "Message": "Message",
        "Skill": "Skill",
        "Input skill": "Input skill",
        "Save": "Save",
        "Cancel": "Cancel",
        "Submit": "Submit",
        "Select avatar image": "Select avatar image",
        "Upload avatar": "Upload avatar",
        "Title": "Title",
        "Input title": "Input title",
        "Input tags": "Input tags",
        "Tags": "Tags",
        "Description": "Description",
        "Input description": "Input description",
        "Image": "Image",
        "Preview": "Preview",
        "Create": "Create",
        "Update": "Update",
        "Publish": "Publish",
        "Profile": "Profile",
        "Work list": "Work list",
        "Works": "Works",
        "Designer": "Designer",
        "Popular": "Popular",
        "New": "New",
        "Languages": "Languages",
        "Language": "Language",
        "Settings": "Settings",
        "Sign in": "Sign in",
        "Sign out": "Sign out",
        "Password": "Password",
        "Create account": "Create acount",
        "location": "location",
        "Initial registration profile": "Initial registration profile",
        "User list": "User list",
        "Work post": "Work post",
        "Work update": "Work update",
        "New mail address" : "New mail address",
        "Credential" : "Credential",
        "Update a credential email" : "Update a credential email",
        "Update password": "Update password",
        "New password" : "New password",
        "Old password" : "Old password",
        "Not Found": "Not Found",
        "Bold": "Bold",
        "Heading": "Heading",
        "Italic" : "Italic",
        "Numbered list" : "Numbered list",
        "Generic list" : "Generic list",
        "Insert horizontal line" : "Insert horizontal line",
        "Create link" : "Create link",
        "Quote" : "Quote",
        "Code" : "Code",
        "Insert table" : "Insert table",
        "Strikethrough" : "Strikethrough",
        "Public mail address": "Public mail address",
        "Toggle password visibility": "Toggle password visibility",
        "Error": "Error",
        "User": "User",
        "How to use Markdown": "How to use Markdown",
        "Hint": "Hint",
        "Font style": "Font style",
        "Decoration": "Decoration",
        "Table": "Table",
        "List": "List",
        "Popular tags": "Popular tags",
        "Please enter using capital and small letters which are combined and more than 8 letters":
          "Please enter using capital and small letters which are combined and more than 8 letters"
    },
    jp: {
        "Name": "名前",
        "Display name": "表示名",
        "Mail address": "メールアドレス",
        "Career": "経歴",
        "Message": "一言メッセージ",
        "Skill": "スキル",
        "Input skill": "スキルを入力",
        "Save": "保存",
        "Cancel": "キャンセル",
        "Submit": "提出",
        "Select avatar image": "アバター画像を選択",
        "Upload avatar": "アバターをアップロード",
        "Title": "タイトル",
        "Input title": "タイトルを入力",
        "Input tags": "タグを入力",
        "Tags": "タグ",
        "Description": "詳細",
        "Input description": "説明を入力",
        "Image": "画像",
        "Preview": "プレビュー",
        "Create": "作成する",
        "Update": "更新する",
        "Publish": "公開する",
        "Profile": "プロフィール",
        "Work list": "作品一覧",
        "Works": "作品一覧",
        "Designer": "デザイナー",
        "Popular": "人気",
        "New": "新着",
        "Languages": "言語",
        "Language": "言語",
        "Settings": "設定",
        "Sign in": "サインイン",
        "Sign out": "サインアウト",
        "Password": "パスワード",
        "Create account": "アカウントを作成",
        "location": "日本",
        "Initial registration profile": "プロフィールの初期登録",
        "User list": "ユーザ一覧",
        "Work post": "作品投稿",
        "Work update": "作品更新",
        "New mail address" : "新しいメールアドレス",
        "Credential" : "認証情報",
        "Update a credential email" : "認証用メールアドレスの更新",
        "Update password": "認証用パスワードの更新",
        "New password" : "新しいパスワード",
        "Old password" : "元のパスワード",
        "Not Found": "Not Found",
        "Bold": "太字",
        "Heading": "見出し",
        "Italic" : "斜体",
        "Numbered list" : "番号付きリスト",
        "Generic list" : "リスト",
        "Insert horizontal line" : "横線を挿入",
        "Create link" : "リンクを作成",
        "Quote" : "引用",
        "Code" : "コード",
        "Insert table" : "テーブルを挿入",
        "Strikethrough" : "取り消し線",
        "Public mail address": "公開用メールアドレス",
        "Toggle password visibility": "パスワード表示切り替え",
        "Error": "エラー",
        "User": "ユーザ",
        "How to use Markdown": "Markdownの使い方",
        "Hint": "ヒント",
        "Font style": "フォントスタイル",
        "Decoration": "装飾",
        "Table": "テーブル",
        "List": "リスト",
        "Popular tags": "人気のタグ",
        "Please enter using capital and small letters which are combined and more than 8 letters": "大文字小文字英数字含む8文字以上で入力してください"
    }
};

export default locationTextList;
