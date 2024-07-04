import React from "react";

const Settings: React.FC = () => {
    const [component, setComponent]  = useState(null)
    useEffect( () => {
        const component = ModuleMangare.app.get(query.slug)
        setComponent(component)
    })

    if(null) {
        return 404
    }
    return (
        <></>

    );
};
// auth/login
// app/record


(globalThis as any).moduleManager.registerSettings('user', Settings)