
import { useState, useEffect, useRef, useReducer } from "react"
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 10
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive" | "success"
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

// Create a unique ID for each toast
const generateId = () => Math.random().toString(36).slice(2, 9)

// Custom reducer to handle toast state
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Dismiss all toasts
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        }
      }

      // Dismiss specific toast
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      }
    }

    case "REMOVE_TOAST": {
      const { toastId } = action

      // Remove all toasts
      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }

      // Remove specific toast
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }
    }
  }
}

export function useToast() {
  const [state, dispatch] = useReducer(reducer, { toasts: [] })
  const scheduled = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const { toasts } = state

  const toast = (props: Omit<ToasterToast, "id">) => {
    const id = generateId()
    const newToast = { id, open: true, ...props }

    // Add toast
    dispatch({ type: "ADD_TOAST", toast: newToast })

    return id
  }

  const update = (props: Partial<ToasterToast>) => {
    if (!props.id) {
      return
    }

    dispatch({ type: "UPDATE_TOAST", toast: props })
  }

  const dismiss = (toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId })
  }

  const remove = (toastId?: string) => {
    dispatch({ type: "REMOVE_TOAST", toastId })
  }

  // Set up cleanup for toasts
  useEffect(() => {
    toasts.forEach((toast) => {
      if (!toast.open && !scheduled.current[toast.id]) {
        scheduled.current[toast.id] = setTimeout(() => {
          remove(toast.id)
          delete scheduled.current[toast.id]
        }, TOAST_REMOVE_DELAY)
      }
    })
  }, [toasts])

  return {
    toasts,
    toast,
    dismiss,
    remove,
  }
}

// Export a standalone toast function that can be used directly
let globalToastState: ReturnType<typeof useToast> | null = null

export const toast = (props: Omit<ToasterToast, "id">) => {
  if (globalToastState) {
    return globalToastState.toast(props)
  }
  console.warn('Toast called before useToast hook initialized')
  return ''
}

// Helper function to initialize global toast state
export const initializeToast = (toastState: ReturnType<typeof useToast>) => {
  globalToastState = toastState
}

// Define toast types
export type { ToasterToast }
