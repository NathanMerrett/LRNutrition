import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'kavbcyru',
    dataset: 'production'
  },
  deployment: {
    autoUpdates: true,
    appId: 'hf373cgv5hij6ge390ksey4x'
  }
})
