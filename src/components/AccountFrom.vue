<template>
  <v-card class="mx-auto my-12 pa-5" max-width="800">
    <v-card-title>
      <h2>Управление учетными записями</h2>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <!-- Базовая форма для добавления новой учетной записи -->
      <v-row align="center" class="mb-4">
        <v-text-field
          v-model="tempAccount.labelStr"
          label="Метка"
          outlined
          dense
          placeholder="Введите метки через ;"
          class="mr-4"
        />
        <v-text-field
          v-model="tempAccount.login"
          label="Логин"
          outlined
          dense
          :rules="loginRules"
          class="mr-4"
          :error-messages="loginError ? ['Поле обязательно'] : []"
        />
        <v-select
          v-model="tempAccount.type"
          :items="['LDAP', 'Local']"
          label="Тип записи"
          outlined
          dense
          class="mr-4"
        />
        <v-text-field
          v-if="tempAccount.type === 'Local'"
          v-model="tempAccount.password"
          label="Пароль"
          outlined
          dense
          :rules="passwordRules"
          class="mr-4"
          :type="tempAccount.showPassword ? 'text' : 'password'"
          append-icon="mdi-eye"
          @click:append="togglePasswordVisibility(tempAccount)"
          :error-messages="passwordError ? ['Поле обязательно'] : []"
        />
        <!-- Кнопка для сохранения новой учетной записи -->
        <v-btn @click="handleAddAccount" icon>
          <v-icon color="primary">mdi-plus-circle-outline</v-icon>
        </v-btn>
      </v-row>

      <!-- Список учетных записей с анимацией -->
      <transition-group name="fade-slide" tag="div">
        <v-row
          v-for="(account, index) in accounts"
          :key="account.id"
          align="center"
          class="mb-4"
        >
          <v-text-field
            v-model="account.labelStr"
            label="Метка"
            outlined
            dense
            class="mr-4"
            :readonly="true"
          />
          <v-text-field
            v-model="account.login"
            label="Логин"
            outlined
            dense
            class="mr-4"
            :readonly="true"
          />
          <v-select
            v-model="account.type"
            :items="['LDAP', 'Local']"
            label="Тип записи"
            outlined
            dense
            class="mr-4"
            :readonly="true"
          />
          <v-text-field
            v-if="account.type === 'Local'"
            v-model="account.password"
            label="Пароль"
            outlined
            dense
            class="mr-4"
            :type="account.showPassword ? 'text' : 'password'"
            append-icon="mdi-eye"
            @click:append="togglePasswordVisibility(account)"
            :readonly="true"
          />
          <!-- Кнопка для удаления учетной записи -->
          <v-btn @click="handleDeleteAccount(account.id)" icon>
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </v-row>
      </transition-group>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useAccountStore } from '../stores/accountStore';
import type { Account } from '../stores/accountStore';

export default defineComponent({
  setup() {
    const store = useAccountStore();
    store.loadAccounts();

    const tempAccount = ref<Account>({
      id: 0, // Временный ID
      label: [],
      labelStr: '',
      type: 'Local',
      login: '',
      password: null,
      showPassword: false,
    });

    const loginError = ref(false);
    const passwordError = ref(false);

    const loginRules = [
      (v: string) => !!v || 'Логин обязателен',
      (v: string) => v.length <= 100 || 'Логин не должен превышать 100 символов',
    ];

    const passwordRules = [
      (v: string) => !!v || 'Пароль обязателен',
      (v: string) => v.length <= 100 || 'Пароль не должен превышать 100 символов',
    ];

    const handleAddAccount = () => {
      loginError.value = !tempAccount.value.login;
      passwordError.value = tempAccount.value.type === 'Local' && !tempAccount.value.password;

      if (loginError.value || passwordError.value) {
        return;
      }

      const newAccount: Account = { ...tempAccount.value, id: Date.now() };
      newAccount.label = tempAccount.value.labelStr.split(';').map(label => ({ text: label.trim() }));
      store.addAccount(newAccount);

      tempAccount.value = {
        id: 0,
        label: [],
        labelStr: '',
        type: 'Local',
        login: '',
        password: null,
        showPassword: false,
      };
    };

    const handleDeleteAccount = (id: number) => {
      store.deleteAccount(id);
    };

    const togglePasswordVisibility = (account: Account) => {
      account.showPassword = !account.showPassword;
    };

    return {
      accounts: store.accounts,
      tempAccount,
      handleAddAccount,
      handleDeleteAccount,
      togglePasswordVisibility,
      loginError,
      passwordError,
      loginRules,
      passwordRules,
    };
  },
});
</script>

<style scoped>
.v-card-title {
  display: flex;
  align-items: center;
}

.v-btn {
  margin-left: auto;
}

.v-text-field, .v-select {
  max-width: 200px;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
