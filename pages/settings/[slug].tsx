import React from "react"
import { useRouter } from 'next/router'
import { ModuleManager } from "@/core/module/module.manager"

const Settings = () => {
    const router = useRouter()
    const { slug } = router.query as { slug: string}
    const Component = ModuleManager.get().components.settings(slug)

    if(!Component) {
        // TODO: Redirect to 404
        return <>Resource Not Found!</>
    }
    return <Component />
}

export default Settings