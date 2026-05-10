import { petAssets, petAssetsByKey } from "./petData.js";

if (petAssetsByKey.turn_head) {
  petAssetsByKey.turnHead = petAssetsByKey.turn_head;
  petAssets.lightReminder = petAssetsByKey.turn_head;
}