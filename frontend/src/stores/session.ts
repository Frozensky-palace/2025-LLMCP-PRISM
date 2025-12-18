/**
 * PRISM 会话状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session, Version, GenerateRequest, FeedbackRequest } from '@/types'
import { prismApi } from '@/api/prism'

export const useSessionStore = defineStore('session', () => {
  // 状态
  const currentSession = ref<Session | null>(null)
  const currentVersion = ref<Version | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const hasSession = computed(() => currentSession.value !== null)
  const hasVersions = computed(() => (currentSession.value?.versions.length ?? 0) > 0)
  const latestVersion = computed(() => {
    if (!currentSession.value?.versions.length) return null
    return currentSession.value.versions[currentSession.value.versions.length - 1]
  })

  // 方法

  /**
   * 生成图片
   */
  async function generate(userInput: string) {
    loading.value = true
    error.value = null

    try {
      const request: GenerateRequest = {
        user_input: userInput,
        session_id: currentSession.value?.id,
      }

      const response = await prismApi.generate(request)

      // 更新会话状态
      if (!currentSession.value) {
        currentSession.value = {
          id: response.session_id,
          created_at: response.created_at,
          updated_at: response.created_at,
          versions: [],
        }
      }

      // 添加新版本
      const newVersion: Version = {
        id: `${response.session_id}-v${response.version}`,
        session_id: response.session_id,
        version_number: response.version,
        parent_version_id: null,
        user_input: userInput,
        schema: response.schema,
        prompt: response.prompt,
        image_url: response.image_url,
        created_at: response.created_at,
      }

      currentSession.value.versions.push(newVersion)
      currentVersion.value = newVersion

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || '生成失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 提交反馈并迭代
   */
  async function submitFeedback(feedback: string) {
    if (!currentSession.value || !currentVersion.value) {
      error.value = '请先生成图片'
      return
    }

    loading.value = true
    error.value = null

    try {
      const request: FeedbackRequest = {
        session_id: currentSession.value.id,
        version: currentVersion.value.version_number,
        feedback,
      }

      const response = await prismApi.feedback(request)

      // 添加新版本
      const newVersion: Version = {
        id: `${response.session_id}-v${response.version}`,
        session_id: response.session_id,
        version_number: response.version,
        parent_version_id: `${response.session_id}-v${response.parent_version}`,
        user_feedback: feedback,
        schema: response.schema,
        prompt: response.prompt,
        diff: response.diff,
        image_url: response.image_url,
        created_at: response.created_at,
      }

      currentSession.value.versions.push(newVersion)
      currentVersion.value = newVersion

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || '反馈提交失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 切换到指定版本
   */
  function switchToVersion(versionNumber: number) {
    if (!currentSession.value) return

    const version = currentSession.value.versions.find(
      (v) => v.version_number === versionNumber
    )

    if (version) {
      currentVersion.value = version
    }
  }

  /**
   * 回滚到指定版本
   */
  async function rollbackTo(versionNumber: number) {
    if (!currentSession.value) {
      error.value = '没有活动会话'
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await prismApi.rollback(currentSession.value.id, versionNumber)

      // 添加新版本（基于回滚版本）
      const newVersion: Version = {
        id: `${response.session_id}-v${response.version}`,
        session_id: response.session_id,
        version_number: response.version,
        parent_version_id: `${response.session_id}-v${versionNumber}`,
        schema: response.schema,
        prompt: response.prompt,
        diff: response.diff,
        image_url: response.image_url,
        created_at: response.created_at,
      }

      currentSession.value.versions.push(newVersion)
      currentVersion.value = newVersion

      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || '回滚失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 加载会话历史
   */
  async function loadSession(sessionId: string) {
    loading.value = true
    error.value = null

    try {
      const session = await prismApi.getSessionVersions(sessionId)
      currentSession.value = session
      currentVersion.value = session.versions[session.versions.length - 1] || null
    } catch (err: any) {
      error.value = err.response?.data?.message || '加载会话失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置状态
   */
  function reset() {
    currentSession.value = null
    currentVersion.value = null
    loading.value = false
    error.value = null
  }

  return {
    // 状态
    currentSession,
    currentVersion,
    loading,
    error,

    // 计算属性
    hasSession,
    hasVersions,
    latestVersion,

    // 方法
    generate,
    submitFeedback,
    switchToVersion,
    rollbackTo,
    loadSession,
    reset,
  }
})
