export type NetworkType = 'bitcoin' | 'testnet' | 'signet' | 'regtest';
export type WPKH = 'default' | null | '' | 'p2wpkh' | 'wpkh' | undefined;
export type P2PKH = 'p2pkh' | 'pkh';
export type SHP2WPKH = 'shp2wpkh' | 'p2shp2wpkh';
export interface CreateWalletRequest {
    mnemonic?: string;
    descriptor?: string;
    password?: string;
    network?: NetworkType;
    blockChainConfigUrl?: string;
    blockChainSocket5?: string;
    retry?: string;
    timeOut?: string;
    blockChainName?: string;
}
export interface CreateWalletResponse {
    address: string;
}
