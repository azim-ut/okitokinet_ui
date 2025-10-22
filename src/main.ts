import './assets/main.css'
import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import AppText from '@/data/ru/app_text.json';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {aliases} from "vuetify/iconsets/mdi";
import {mdi} from "vuetify/iconsets/mdi-svg";
import type {Emit} from "@/models/enum/Emit.ts";


import App from './App.vue'

const vuetify = createVuetify({
    theme: {
        defaultTheme: 'dark',//light|dark
        themes: {
            light: {
                dark: false,
                colors: {
                    background: '#FFFFFF',
                    primary: '#1976D2',
                    surface: '#F5F5F5',
                },
            },
            dark: {
                dark: true,
                colors: {
                    background: '#121212',
                    surface: '#1E1E1E',
                    primary: '#BB86FC',
                    secondary: '#03DAC6',
                    error: '#CF6679',
                },
            },
        },
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi
        }
    },
    components,
    directives,
})

export const appText = AppText

const app = createApp(App)

app
    .use(router)
    .use(vuetify)
    .use(createPinia())
    .mount('#app')


export function fetchLocalizedText(target: any){
    let langTemp = getCookie('localized')
    if(!langTemp){
        const browserLanguage = navigator.language;
        langTemp = ["en", "es", "ru", "fr", "cn", "de"]
            .filter(lang => browserLanguage.startsWith(lang))
            .pop()
    }
    if(!langTemp){
        return target
    }
    let out = Object.assign({}, target)
    switch (langTemp) {
        case 'ru': out = Object.assign(out, appText); break;
    }
    return out
}


export function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
}

export function castEvent(emit: Emit, data: any = {}){
    console.log(emit, data)
    window.dispatchEvent(new CustomEvent(emit, {
        detail: data
    }));
}

if (import.meta.hot) {
    import.meta.hot.accept(() => {
        window.location.reload(); // full reload to avoid partial state
    });
}