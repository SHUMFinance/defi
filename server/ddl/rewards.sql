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

 Date: 23/03/2022 17:36:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for rewards
-- ----------------------------
DROP TABLE IF EXISTS `rewards`;
CREATE TABLE `rewards` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `chainID` int(4) DEFAULT NULL COMMENT 'chainID',
  `address` varchar(64) DEFAULT NULL COMMENT '接受地址',
  `total` varchar(64) DEFAULT NULL COMMENT 'total',
  `lastStart` varchar(64) DEFAULT NULL COMMENT 'last Start',
  `signer` varchar(64) DEFAULT NULL COMMENT '签名人',
  `signature` varchar(256) DEFAULT NULL COMMENT '签名',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
