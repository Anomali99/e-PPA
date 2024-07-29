 drop database if exists `db_ppa`;
 create database `db_ppa`;

 use db_ppa;

 create table if not exists `users` (
    `user_id` int auto_increment,
    `user_uuid` text not null,
    `username` varchar(30) not null,
    `password` text not null,
    primary key(`user_id`)
 ) engine=InnoDB default charset=utf8;

 create table if not exists `school` (
    `school_id` int auto_increment,
    `school_uuid` text not null,
    `name` text not null,
    primary key(`school_id`)
 ) engine=InnoDB default charset=utf8;

 create table if not exists `santri` (
    `santri_id` int auto_increment,
    `santri_uuid` text not null,
    `school_id` int not null,
    `name` varchar(100) not null,
    `nis` varchar(20) not null,
    `address` text not null,
    `parent` varchar(30) not null,
    `gender` varchar(1) not null,
    `yatim` boolean not null,
    primary key(`santri_id`),
    constraint `fk_school_id` foreign key (`school_id`) references `school`(`school_id`)
 ) engine=InnoDB default charset=utf8;

 create table if not exists `spp` (
    `spp_id` int auto_increment,
    `spp_uuid` text not null,
    `month` varchar(10) not null,
    `year` varchar(4) not null,
    `nominal_spp` int not null,
    `nominal_kosma` int not null,
    primary key(`spp_id`)
 ) engine=InnoDB default charset=utf8;

 create table if not exists `spp_santri` (
    `spp_santri_id` int auto_increment,
    `spp_santri_uuid` text not null,
    `santri_id` int not null,
    `spp_id` int not null,
    `datetime` datetime not null,
    primary key(`spp_santri_id`),
    constraint `fk_spp_id` foreign key (`spp_id`) references `spp`(`spp_id`),
    constraint `fk_santri_id` foreign key (`santri_id`) references `santri`(`santri_id`)
 ) engine=InnoDB default charset=utf8;

 create table if not exists `upload` (
   `upload_id` int auto_increment,
   `santri_id` int not null,
   `filename` text not null,
   `datetime` datetime not null,
   primary key(`upload_id`),
    constraint `fk_santri_upload_id` foreign key (`santri_id`) references `santri`(`santri_id`)
 )

