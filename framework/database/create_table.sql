SET SQL_MODE = '';

SET CHARACTER_SET_CLIENT = utf8;

SET CHARACTER_SET_CONNECTION = utf8;


-- Project Name : def_academy
-- Date/Time    : 2023/02/20 15:32:20
-- Author       : dai.yamamoto
-- RDBMS Type   : MySQL
-- Application  : A5:SQL Mk-2

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

-- ユーザー
drop table if exists `users` cascade;

create table `users` (
  `user_id` VARCHAR(64) not null comment 'ユーザーID:ユーザーID'
  , `name` varchar(50) comment 'name'
  , `mail` varchar(255) comment 'mail'
  , `pass` varchar(512) comment 'pass'
  , `join_time` datetime default CURRENT_TIMESTAMP comment 'join_time'
  , `auth_tags` varchar(50) default 'user' comment 'auth_tags'
  , `quite_time` datetime comment 'quite_time'
  , `login_count` int default 1 comment 'ログイン回数:ログイン回数'
  , `is_purchase` TINYINT(1) default 0 comment 'is課金'
  , `limit_project` DOUBLE default 2 comment 'プロジェクト上限:-1:nolimit,'
  , `last_login_dt` datetime on update CURRENT_TIMESTAMP default CURRENT_TIMESTAMP comment '最終ログイン日時:最終ログイン日時'
  , `datetime_expiry` TIMESTAMP default null comment '有効期限最終日時'
  , `is_recieve_mail` char(1) default '1' comment 'is_recieve_mail'
  , `oauth_uid` varchar(100) comment 'oauth_uid'
  , `update_dt` datetime on update CURRENT_TIMESTAMP default CURRENT_TIMESTAMP comment 'update_dt'
  , `insert_dt` datetime default CURRENT_TIMESTAMP comment 'insert_dt'
  , `delete_dt` datetime comment 'delete_dt'
  , constraint `users_PKC` primary key (`user_id`)
) comment 'ユーザー' ;

alter table `users` add unique `mail` (`mail`) ;

