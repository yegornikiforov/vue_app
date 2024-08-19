import { defineStore } from 'pinia';

export interface LabelObject {
  text: string;
}

export interface Account {
  id: number;
  label: LabelObject[];
  labelStr: string;
  type: 'LDAP' | 'Local';
  login: string;
  password: string | null;
  showPassword?: boolean;
}

export const useAccountStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount(newAccount: Account) {
      if (!newAccount.login || !newAccount.label.length) {
        console.error('Required fields are missing');
        return;
      }

      this.accounts.unshift(newAccount);
      this.saveAccounts();
    },
    deleteAccount(id: number) {
      this.accounts = this.accounts.filter(account => account.id !== id);
      this.saveAccounts();
    },
    loadAccounts() {
      const savedAccounts = localStorage.getItem('accounts');
      if (savedAccounts) {
        this.accounts = JSON.parse(savedAccounts) as Account[];
      }
    },
    saveAccounts() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts));
    }
  },
});
