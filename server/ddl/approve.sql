/*
 Navicat Premium Data Transfer

 Source Server         : p2
 Source Server Type    : MySQL
 Source Server Version : 50728
 Source Host           : 116.62.119.4:3306
 Source Schema         : server

 Target Server Type    : MySQL
 Target Server Version : 50728
 File Encoding         : 65001

 Date: 23/03/2022 17:36:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for approve
-- ----------------------------
DROP TABLE IF EXISTS `approve`;
CREATE TABLE `approve` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `txid` varchar(128) DEFAULT NULL COMMENT 'txid',
  `address` varchar(64) DEFAULT NULL COMMENT 'address',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
