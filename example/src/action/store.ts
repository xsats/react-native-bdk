import WalletStore from '../../../src/store/walletstore';

export const walletStore = new WalletStore();
const PIN_KEY = 'bdk.pin';

//
// Init and startup
//

export async function savePinToDisk(pin) {
  await walletStore.setItem(PIN_KEY, pin);
}

export async function saveToDisk(wallet, pin) {
  await savePinToDisk(pin);
  walletStore.wallets.push(wallet);
  await walletStore.saveToDisk();
}

export async function loadFromDisk() {
  try {
    await walletStore.loadFromDisk();
  } catch (err) {
    console.error(err);
  }
}
