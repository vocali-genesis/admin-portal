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
        <>TopBar</>
        <menu></menu>
        <frame>
            <compoment( ..props)>
        </frame>

    );
};
// auth/login
// app/record


export default Settings;