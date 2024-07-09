import React from "react"
import { useRouter } from 'next/router'
import { ModuleManager } from "@/core/module/module.manager"
import { notFound } from 'next/navigation'

const App = () => {
    const router = useRouter()
    const { slug } = router.query as { slug: string}
    const Component = ModuleManager.get().components.app(slug)
    if(!Component) {
        // TODO: Redirect to 404
        return <>Resource Not Found!</>
    }
    return <Component />
}

export default App