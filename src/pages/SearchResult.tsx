import { useParams, useNavigate } from 'react-router'
import { useSearch } from '@/hooks'
import { apiService } from '@/services/api.service'
import { useState, useEffect, useRef, useMemo } from 'react'
import { type VideoItem } from '@/types'
import { useApiStore } from '@/store/apiStore'
import { Card, CardFooter, Image, CardHeader, Chip } from '@heroui/react'
import { Spinner } from '@heroui/spinner'
import { NoResultIcon } from '@/components/icons'

export default function SearchResult() {
  const abortCtrlRef = useRef<AbortController | null>(null)
  const { videoAPIs } = useApiStore()
  const navigate = useNavigate()

  const { query } = useParams()
  const { search, setSearch, searchMovie } = useSearch()
  const [searchRes, setSearchRes] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('变化了:', loading)
  }, [loading])

  const selectedAPIs = useMemo(() => {
    return videoAPIs.filter(api => api.isEnabled)
  }, [videoAPIs])

  useEffect(() => {
    if (query && search === '') {
      setLoading(true)
      setSearch(query)
      searchMovie(query, false)
    }
  }, [query, search, setSearch, searchMovie])

  useEffect(() => {
    setLoading(true)
    // 调用搜索内容
    const fetchSearchRes = async () => {
      if (!search) return
      // 取消上一次未完成的搜索
      abortCtrlRef.current?.abort()
      const controller = new AbortController()
      abortCtrlRef.current = controller
      setSearchRes([])
      try {
        await apiService.aggregatedSearch(
          search,
          selectedAPIs,
          newResults => {
            setSearchRes(prevResults => {
              const allResults = [...prevResults, ...newResults]
              allResults.sort((a, b) => {
                const nameCompare = (a.vod_name || '').localeCompare(b.vod_name || '')
                if (nameCompare !== 0) return nameCompare
                return (a.source_name || '').localeCompare(b.source_name || '')
              })
              return allResults
            })
          },
          controller.signal,
        )
        setLoading(false)
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.log('搜索已取消')
        } else {
          console.error('搜索时发生错误:', error)
        }
      }
    }
    if (search) {
      fetchSearchRes()
    }
  }, [search, selectedAPIs])

  // 组件卸载时取消未完成的搜索
  useEffect(() => {
    return () => {
      abortCtrlRef.current?.abort()
    }
  }, [])

  // 处理卡片点击
  const handleCardClick = (item: VideoItem) => {
    // 导航到视频详情页，传递必要的参数
    navigate(`/detail/${item.source_code}/${item.vod_id}`, {
      state: { videoItem: item },
    })
  }

  return (
    <div className="p-4">
      {/* 搜索结果网格 */}
      {!loading && searchRes?.length > 0 && (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4">
          {searchRes?.map((item, index) => (
            <Card
              key={`${item.source_code}_${item.vod_id}_${index}`}
              isPressable
              isFooterBlurred
              onPress={() => handleCardClick(item)}
              className="w-full border-none transition-transform hover:scale-103"
              radius="lg"
            >
              <CardHeader className="absolute top-1 z-10 flex-col items-start p-3">
                <div className="rounded-large bg-black/20 px-2 py-1 backdrop-blur">
                  <p className="text-tiny font-bold text-white/80 uppercase">{item.source_name}</p>
                </div>
                {item.vod_remarks && (
                  <Chip
                    size="sm"
                    color="warning"
                    variant="flat"
                    className="bg-warning/80 mt-2 backdrop-blur"
                  >
                    {item.vod_remarks}
                  </Chip>
                )}
              </CardHeader>
              <Image
                removeWrapper
                isZoomed
                loading="lazy"
                alt={item.vod_name}
                className="z-0 h-full object-cover"
                src={
                  item.vod_pic || 'https://placehold.jp/30/ffffff/000000/300x450.png?text=暂无封面'
                }
              />
              <CardFooter className="rounded-large shadow-small absolute bottom-1 z-10 ml-1 min-h-[8vh] w-[calc(100%_-_8px)] justify-between overflow-hidden border-1 border-white/20 py-2 backdrop-blur before:rounded-xl before:bg-white/10">
                <div className="flex flex-grow flex-col gap-1 px-1">
                  <p className="text-tiny text-white/80">
                    {item.type_name} · {item.vod_year}
                  </p>
                  <p className="line-clamp-2 text-sm font-semibold text-white">{item.vod_name}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* 加载中 */}
      {loading && (
        <div className="flex flex-col items-center py-40">
          <Spinner
            classNames={{ label: 'text-gray-500 text-sm' }}
            variant="wave"
            size="lg"
            color="default"
            label="搜索中..."
          />
        </div>
      )}

      {/* 无结果提示 */}
      {!loading && searchRes?.length === 0 && (
        <div className="flex flex-col items-center py-20">
          <NoResultIcon size={200}></NoResultIcon>
          <p className="text-gray-500">没有找到相关内容，试试别的关键词吧~</p>
        </div>
      )}
    </div>
  )
}
