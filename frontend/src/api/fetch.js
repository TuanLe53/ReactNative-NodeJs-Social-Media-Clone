import { useEffect, useState } from "react"

const getData = async (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(url);
                const result = await response.json();
                setData(result)
                
            } catch (err) {
                setError(`${err} Couldn't fetch data`)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [url])

    return {data, isLoading, error}
}