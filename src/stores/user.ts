import { defineStore } from 'pinia'

export interface UserProfileData {
  id: number
  name: string
  city: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null as UserProfileData | null,
    city: null as string | null,
  }),
  actions: {
    setProfile(profile: UserProfileData) {
      this.profile = profile
      this.city = profile.city
    },
    setCity(city: string | null) {
      this.city = city
    },
    reset() {
      this.profile = null
      this.city = null
    },
  },
})
