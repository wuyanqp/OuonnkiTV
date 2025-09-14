import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  Textarea,
  addToast,
} from '@heroui/react'
import { PROXY_URL } from '@/config/api.config'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useApiStore } from '@/store/apiStore'
import type { VideoApi } from '@/types'

import { UploadIcon, CodeIcon, GlobeIcon, DownloadIcon } from '@/components/icons'

interface ImportSourceModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function ImportSourceModal({ isOpen, onOpenChange }: ImportSourceModalProps) {
  const { importVideoAPIs } = useApiStore()
  const [importMode, setImportMode] = useState<'file' | 'text' | 'url'>('file')
  const [isImporting, setIsImporting] = useState(false)

  // 文件上传
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // JSON文本输入
  const [jsonText, setJsonText] = useState('')

  // URL输入
  const [jsonUrl, setJsonUrl] = useState('')

  // 重置状态
  const resetState = () => {
    setSelectedFile(null)
    setJsonText('')
    setJsonUrl('')
    setIsImporting(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // 验证和解析JSON
  const parseVideoAPIs = (jsonString: string): VideoApi[] => {
    try {
      const data = JSON.parse(jsonString)
      const apis = Array.isArray(data) ? data : [data]

      return apis.map((item, index) => {
        // 验证必需字段
        if (!item.name || !item.url) {
          throw new Error(`第${index + 1}个源缺少必需字段: name 和 url`)
        }

        // 验证URL格式
        try {
          new URL(item.url)
        } catch {
          throw new Error(`第${index + 1}个源的URL格式不正确: ${item.url}`)
        }

        // 如果有detailUrl，也验证格式
        if (item.detailUrl) {
          try {
            new URL(item.detailUrl)
          } catch {
            throw new Error(`第${index + 1}个源的详情URL格式不正确: ${item.detailUrl}`)
          }
        }

        return {
          id: item.id || uuidv4(),
          name: item.name,
          url: item.url,
          detailUrl: item.detailUrl || item.url,
          isEnabled: item.isEnabled !== undefined ? item.isEnabled : true,
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`JSON解析失败: ${error.message}`)
      }
      throw new Error('JSON格式不正确')
    }
  }

  // 处理文件导入
  const handleFileImport = async () => {
    if (!selectedFile) return

    setIsImporting(true)

    try {
      const text = await selectedFile.text()
      const apis = parseVideoAPIs(text)

      importVideoAPIs(apis)

      addToast({
        title: '导入成功',
        description: `成功导入 ${apis.length} 个视频源`,
        severity: 'success',
        timeout: 3000,
      })

      // 导入成功后立即关闭modal
      setTimeout(() => {
        onOpenChange(false)
        resetState()
      }, 500)
    } catch (error) {
      addToast({
        title: '导入失败',
        description: error instanceof Error ? error.message : '导入失败',
        severity: 'danger',
        timeout: 5000,
      })
    } finally {
      setIsImporting(false)
    }
  }

  // 处理文本导入
  const handleTextImport = async () => {
    if (!jsonText.trim()) return

    setIsImporting(true)

    try {
      const apis = parseVideoAPIs(jsonText.trim())

      importVideoAPIs(apis)

      addToast({
        title: '导入成功',
        description: `成功导入 ${apis.length} 个视频源`,
        severity: 'success',
        timeout: 3000,
      })

      // 导入成功后立即关闭modal
      setTimeout(() => {
        onOpenChange(false)
        resetState()
      }, 500)
    } catch (error) {
      addToast({
        title: '导入失败',
        description: error instanceof Error ? error.message : '导入失败',
        severity: 'danger',
        timeout: 5000,
      })
    } finally {
      setIsImporting(false)
    }
  }

  // 处理URL导入
  const handleUrlImport = async () => {
    if (!jsonUrl.trim()) return

    // 验证URL格式
    try {
      new URL(jsonUrl.trim())
    } catch {
      addToast({
        title: '导入失败',
        description: 'URL格式不正确',
        severity: 'danger',
        timeout: 5000,
      })
      return
    }

    setIsImporting(true)

    try {
      const response = await fetch(PROXY_URL + jsonUrl.trim())
      if (!response.ok) {
        throw new Error(`获取文件失败: ${response.status} ${response.statusText}`)
      }

      const text = await response.text()
      const apis = parseVideoAPIs(text)

      importVideoAPIs(apis)

      addToast({
        title: '导入成功',
        description: `成功导入 ${apis.length} 个视频源`,
        severity: 'success',
        timeout: 3000,
      })

      // 导入成功后立即关闭modal
      setTimeout(() => {
        onOpenChange(false)
        resetState()
      }, 500)
    } catch (error) {
      addToast({
        title: '导入失败',
        description: error instanceof Error ? error.message : '导入失败',
        severity: 'danger',
        timeout: 5000,
      })
    } finally {
      setIsImporting(false)
    }
  }

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/json') {
      setSelectedFile(file)
    } else {
      addToast({
        title: '文件类型错误',
        description: '请选择有效的JSON文件',
        severity: 'warning',
        timeout: 3000,
      })
      setSelectedFile(null)
    }
  }

  const getImportButtonProps = () => {
    switch (importMode) {
      case 'file':
        return {
          disabled: !selectedFile || isImporting,
          onClick: handleFileImport,
        }
      case 'text':
        return {
          disabled: !jsonText.trim() || isImporting,
          onClick: handleTextImport,
        }
      case 'url':
        return {
          disabled: !jsonUrl.trim() || isImporting,
          onClick: handleUrlImport,
        }
      default:
        return { disabled: true, onClick: () => {} }
    }
  }

  return (
    <Modal
      classNames={{
        base: 'bg-transparent',
        backdrop: 'bg-white/10',
      }}
      hideCloseButton
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={open => {
        onOpenChange(open)
        if (!open) {
          resetState()
        }
      }}
      size="2xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <DownloadIcon size={20} className="text-gray-600" />
            <span>导入视频源</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-sm font-normal text-gray-500"
          >
            支持从本地文件、JSON字符串或在线链接导入视频源配置
          </motion.p>
        </ModalHeader>

        <ModalBody>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4"
          >
            {/* 导入模式选择 */}
            <Tabs
              selectedKey={importMode}
              onSelectionChange={key => setImportMode(key as typeof importMode)}
              variant="bordered"
              className="w-full"
            >
              <Tab
                key="file"
                title={
                  <div className="flex items-center gap-2">
                    <UploadIcon size={16} />
                    <span>本地文件</span>
                  </div>
                }
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mt-4 bg-white/50 backdrop-blur-lg dark:bg-gray-900/50">
                    <CardBody className="space-y-4">
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-gray-600"
                      >
                        选择本地的JSON配置文件进行导入
                      </motion.p>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="bordered"
                          className="w-full border-dashed bg-gradient-to-br from-gray-50 to-gray-100 transition-all duration-300 hover:from-gray-100 hover:to-gray-200"
                          onPress={() => fileInputRef.current?.click()}
                          startContent={<UploadIcon size={16} />}
                        >
                          {selectedFile ? selectedFile.name : '选择JSON文件'}
                        </Button>
                      </motion.div>

                      <AnimatePresence>
                        {selectedFile && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            transition={{ duration: 0.3, type: 'spring' }}
                            className="flex items-center gap-2 rounded-lg bg-green-50 p-2 text-sm text-green-600"
                          >
                            <span className="text-green-600">✓</span>
                            <span>已选择: {selectedFile.name}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardBody>
                  </Card>
                </motion.div>
              </Tab>

              <Tab
                key="text"
                title={
                  <div className="flex items-center gap-2">
                    <CodeIcon size={16} />
                    <span>JSON文本</span>
                  </div>
                }
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mt-4 bg-white/50 backdrop-blur-lg dark:bg-gray-900/50">
                    <CardBody className="space-y-4">
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-gray-600"
                      >
                        粘贴JSON格式的视频源配置
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Textarea
                          value={jsonText}
                          onValueChange={setJsonText}
                          placeholder='[{"id":"source1","name":"示例源","url":"https://api.example.com","isEnabled":true}]'
                          minRows={8}
                          maxRows={12}
                          className="font-mono text-sm"
                          classNames={{
                            inputWrapper:
                              'bg-gradient-to-br from-default-100/50 to-default-200/30 hover:from-default-200/50 hover:to-default-300/30 transition-all duration-300',
                          }}
                        />
                      </motion.div>
                    </CardBody>
                  </Card>
                </motion.div>
              </Tab>

              <Tab
                key="url"
                title={
                  <div className="flex items-center gap-2">
                    <GlobeIcon size={16} />
                    <span>在线链接</span>
                  </div>
                }
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mt-4 bg-white/50 backdrop-blur-lg dark:bg-gray-900/50">
                    <CardBody className="space-y-4">
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-gray-600"
                      >
                        输入在线JSON文件的URL地址
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Input
                          value={jsonUrl}
                          onValueChange={setJsonUrl}
                          placeholder="https://example.com/sources.json"
                          classNames={{
                            inputWrapper:
                              'bg-gradient-to-br from-default-100/50 to-default-200/30 hover:from-default-200/50 hover:to-default-300/30 transition-all duration-300',
                          }}
                          startContent={<GlobeIcon size={16} className="text-gray-400" />}
                        />
                      </motion.div>
                    </CardBody>
                  </Card>
                </motion.div>
              </Tab>
            </Tabs>

            {/* 格式说明 */}
          </motion.div>
        </ModalBody>

        <ModalFooter>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex w-full gap-3"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                variant="light"
                onPress={() => onOpenChange(false)}
                isDisabled={isImporting}
                className="w-full text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-gray-800"
              >
                取消
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                color="primary"
                className="w-full bg-gradient-to-br from-gray-600 to-gray-800 font-medium text-white shadow-lg transition-all duration-300 hover:from-gray-700 hover:to-gray-900 hover:shadow-xl"
                isLoading={isImporting}
                startContent={!isImporting && <DownloadIcon size={16} />}
                {...getImportButtonProps()}
              >
                {isImporting ? '导入中...' : '开始导入'}
              </Button>
            </motion.div>
          </motion.div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
