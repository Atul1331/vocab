
// Purpose: HANDLES DICTIONARY STATES GLOBALLY

import { useContext, createContext, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { _getMeaning } from '../api/dictionary'
import { useModifiedSWR } from '../hooks'

const DictionaryContext = createContext()

export function DictionaryProvider({ children }) {
  const [searchParams] = useSearchParams({})
  const [word, setWord] = useState('')

  useEffect(() => {
    setWord(searchParams.get('word') || null)
  }, [searchParams])

  useEffect(() => {
    // "document.documentElement.scrollTo" is the magic for React Router Dom v6
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth', // Optional if you want to skip the scrolling animation
    })
  }, [word])

  const { data, isLoading, isError } = useModifiedSWR(
    word ? _getMeaning(word) : null,
  )

  return (
    <DictionaryContext.Provider
      value={{
        word,
        setWord,
        data,
        isLoading,
        errorStatus: isError?.response?.status,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  )
}

export function useDictionary() {
  return useContext(DictionaryContext)
}
