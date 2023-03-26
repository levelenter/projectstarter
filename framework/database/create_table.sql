-- Project Name : def_academy
-- Date/Time    : 2023/03/23 11:17:51
-- Author       : dai.yamamoto
-- RDBMS Type   : MySQL
-- Application  : A5:SQL Mk-2

-- 支払セッション
drop table if exists `payment_session` cascade;

create table `payment_session` (
  `session_id` VARCHAR(64) comment 'セッションID'
  , `user_id` bigint(20) comment 'ユーザーID'
  , `paymentItemType` varchar(20) comment '支払タイプ'
  , `insert_dt` DATETIME default CURRENT_TIMESTAMP not null comment '挿入日時'
  , `update_dt` DATETIME default  CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '更新日時'
  , `delete_dt` DATETIME comment '削除日時'
  , constraint `payment_session_PKC` primary key (`session_id`)
) comment '支払セッション:支払いのセッション情報を保管する' ;

-- クラスメンバー
drop table if exists `class_members` cascade;

create table `class_members` (
  `user_id` INT not null comment 'クラスユーザーID:ユーザーID'
  , `member_id` INT not null comment 'メンバーID'
  , `className` varchar(100) not null comment 'クラス名:クラス名'
  , `name` varchar(50) comment 'name'
  , `last_login_dt`  comment '最終ログイン日時:最終ログイン日時'
  , `login_count` int default 1 comment 'ログイン回数:ログイン回数'
  , `update_dt` datetime on update CURRENT_TIMESTAMP default CURRENT_TIMESTAMP comment 'update_dt'
  , `insert_dt` datetime default CURRENT_TIMESTAMP comment 'insert_dt'
  , `delete_dt` datetime comment 'delete_dt'
  , constraint `class_members_PKC` primary key (`user_id`,`member_id`)
) comment 'クラスメンバー' ;

-- 通知メッセージ
drop table if exists `notify_message` cascade;

create table `notify_message` (
  `notify_id` bigint(20) AUTO_INCREMENT comment '通知ID'
  , `title` VARCHAR(256) comment 'タイトル'
  , `notify_message` VARCHAR(1024) comment '通知メッセージ'
  , `notify_dt` DATETIME comment '通知日時'
  , `insert_dt` DATETIME default CURRENT_TIMESTAMP not null comment '挿入日時'
  , `update_dt` DATETIME default  CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment '更新日時'
  , `delete_dt` DATETIME comment '削除日時'
  , constraint `notify_message_PKC` primary key (`notify_id`)
) comment '通知メッセージ' ;

-- user_block_contents
drop table if exists `user_block_contents` cascade;

create table `user_block_contents` (
  `user_block_contents_id` int auto_increment not null comment 'ユーザブロックコンテンツID'
  , `project_id` varchar(30) not null comment 'マスターID'
  , `user_id` int not null comment 'ユーザID'
  , `member_id` int default -1 comment 'メンバーID'
  , `title` varchar(255) comment 'title'
  , `block_xml` mediumtext comment 'ブロックプログラム'
  , `block_code` mediumtext comment 'ブロックのコード'
  , `js_code` mediumtext comment 'js_code'
  , `is_publish` tinyint default 0 not null comment 'is_publish'
  , `is_group_publish` tinyint default 0 not null comment 'is_group_publish'
  , `likeCount` int default 0 not null comment 'likeCount'
  , `version_no` int default 2 not null comment 'version_no'
  , `insert_dt` datetime default CURRENT_TIMESTAMP comment '挿入日時'
  , `update_dt` datetime on update CURRENT_TIMESTAMP default CURRENT_TIMESTAMP comment '更新日時'
  , `delete_dt` datetime comment '削除日時'
  , constraint `user_block_contents_PKC` primary key (`user_block_contents_id`)
) comment 'user_block_contents' ;

-- ユーザー
drop table if exists `users` cascade;

create table `users` (
  `user_id` int auto_increment not null comment 'ユーザーID:ユーザーID'
  , `name` varchar(50) comment 'name'
  , `mail` varchar(255) comment 'mail'
  , `pass` varchar(50) comment 'pass'
  , `pass_v2` varchar(512) comment 'pass_v2'
  , `belong_to` varchar(40) comment 'belong_to'
  , `join_time` datetime default CURRENT_TIMESTAMP comment 'join_time'
  , `auth_tags` varchar(50) default 'user' comment 'auth_tags'
  , `quite_time` datetime comment 'quite_time'
  , `poly_key` varchar(50) comment 'poly_key'
  , `login_count` int default 1 comment 'ログイン回数:ログイン回数'
  , `is_purchase` TINYINT(1) default 0 comment 'is課金'
  , `limit_project` DOUBLE default 2 comment 'プロジェクト上限:-1:nolimit,'
  , `project_count` DOUBLE default 0 comment 'プロジェクト数'
  , `uploaded_bytes` doub default 0 comment 'アップロードバイト数'
  , `last_login_dt` datetime on update CURRENT_TIMESTAMP default CURRENT_TIMESTAMP comment '最終ログイン日時:最終ログイン日時'
  , `datetime_expiry` TIMESTAMP default null comment '有効期限最終日時'
  , `update_dt` datetime on update CURRENT_TIMESTAMP default CURRENT_TIMESTAMP comment 'update_dt'
  , `insert_dt` datetime default CURRENT_TIMESTAMP comment 'insert_dt'
  , `delete_dt` datetime comment 'delete_dt'
  , `is_recieve_mail` char(1) default '1' comment 'is_recieve_mail'
  , `join_event_tags` varchar(50) default '2016axis' comment 'join_event_tags'
  , `oauth_uid` varchar(100) comment 'oauth_uid'
  , constraint `users_PKC` primary key (`user_id`)
) comment 'ユーザー' ;

alter table `users` add unique `mail` (`mail`) ;

