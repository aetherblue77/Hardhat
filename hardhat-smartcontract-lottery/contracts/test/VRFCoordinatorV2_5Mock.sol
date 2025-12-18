// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// PERBAIKAN: Gunakan 'as' untuk memberi nama beda pada library aslinya
import {VRFCoordinatorV2_5Mock as BaseMock} from "@chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2_5Mock.sol";

// Nama kontrak kita tetap VRFCoordinatorV2_5Mock (agar script deploy terbaca)
// Kita mewarisi dari 'BaseMock'
contract VRFCoordinatorV2_5Mock_Local is BaseMock {
    constructor(
        uint96 _baseFee,
        uint96 _gasPriceLink,
        int256 _weiPerUnitLink
    ) BaseMock(_baseFee, _gasPriceLink, _weiPerUnitLink) {}
}