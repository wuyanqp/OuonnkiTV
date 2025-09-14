import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { VideoApi } from '@/types'
import { getInitialVideoSources } from '@/config/api.config'

interface ApiState {
  // 自定义 API 列表
  videoAPIs: VideoApi[]
  // 广告过滤开关
  adFilteringEnabled: boolean
}

interface ApiActions {
  // 设置 API 启用状态
  setApiEnabled: (apiId: string, enabled: boolean) => void
  // 添加视频 API
  addAndUpdateVideoAPI: (api: VideoApi) => void
  // 删除视频 API
  removeVideoAPI: (apiId: string) => void
  // 设置广告过滤
  setAdFilteringEnabled: (enabled: boolean) => void
  // 全选 API
  selectAllAPIs: () => void
  // 取消全选
  deselectAllAPIs: () => void
  // 初始化环境变量中的视频源
  initializeEnvSources: () => void
  // 批量导入视频源
  importVideoAPIs: (apis: VideoApi[]) => void
}

type ApiStore = ApiState & ApiActions

export const useApiStore = create<ApiStore>()(
  devtools(
    persist(
      immer<ApiStore>(set => ({
        videoAPIs: [],
        adFilteringEnabled: true,

        // Actions
        setApiEnabled: (apiId: string, enabled: boolean) => {
          set(state => {
            const api = state.videoAPIs.find(a => a.id === apiId)
            if (api) {
              api.isEnabled = enabled
            }
          })
        },

        addAndUpdateVideoAPI: (api: VideoApi) => {
          set(state => {
            const existingApi = state.videoAPIs.find(a => a.name === api.name)
            if (existingApi) {
              state.videoAPIs = state.videoAPIs.map(a => (a.id === existingApi.id ? api : a))
            } else {
              state.videoAPIs.push(api)
            }
          })
        },

        removeVideoAPI: (apiId: string) => {
          set(state => {
            state.videoAPIs = state.videoAPIs.filter(api => api.id !== apiId)
          })
        },

        setAdFilteringEnabled: (enabled: boolean) => {
          set(state => {
            state.adFilteringEnabled = enabled
          })
        },

        selectAllAPIs: () => {
          set(state => {
            state.videoAPIs = state.videoAPIs.map(api => ({ ...api, isEnabled: true }))
          })
        },

        deselectAllAPIs: () => {
          set(state => {
            state.videoAPIs = state.videoAPIs.map(api => ({ ...api, isEnabled: false }))
          })
        },

        initializeEnvSources: async () => {
          const envSources = await getInitialVideoSources()
          set(state => {
            if (envSources.length > 0) {
              // 只添加不存在的环境变量源
              envSources.forEach(envSource => {
                if (envSource) {
                  // 确保 envSource 不为 null
                  const exists = state.videoAPIs.some(
                    api =>
                      api.id === envSource.id ||
                      (api.name === envSource.name && api.url === envSource.url),
                  )
                  if (!exists) {
                    state.videoAPIs.push(envSource)
                  }
                }
              })
            }
          })
        },

        importVideoAPIs: (apis: VideoApi[]) => {
          set(state => {
            apis.forEach(api => {
              // 检查是否已存在相同的源（基于name和url）
              const exists = state.videoAPIs.some(
                existingApi =>
                  existingApi.id === api.id ||
                  (existingApi.name === api.name && existingApi.url === api.url),
              )
              if (!exists) {
                state.videoAPIs.push(api)
              }
            })
          })
        },
      })),
      {
        name: 'ouonnki-tv-api-store', // 持久化存储的键名
        version: 4, // 更新版本号以触发迁移
        migrate: (persistedState: unknown, version: number) => {
          const state = persistedState as Partial<ApiState>

          if (version < 4) {
            state.videoAPIs = []
          }

          return state
        },
      },
    ),
    {
      name: 'ApiStore', // DevTools 中显示的名称
    },
  ),
)
