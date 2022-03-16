import { useState } from 'react'
import { saveAs } from 'file-saver'


const Button = ({ children, onCLick, className = 'bg-blue-500 hover:bg-blue-400 text-white' }) => {
    return (
        <button
            onClick={onCLick}
            className={`rounded-xl px-4 py-2 m-2 capitalize font-semibold ${className}`}
        >
            { children }
        </button>
    );
}

const File = ({ onChange }) => {
    return (
        <input 
            type="file" 
            className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100" 
            onChange={onChange} 
        />
    )
}

const Input = ({ value, onChange }) => {
    return (
        <input 
            type="text" 
            className="w-full bg-gray-200/30 text-white p-2 rounded-xl mb-5" 
            value={value}
            onChange={onChange}
        />
    )
}

export default function Home() {

    const [fileContent, setFileContent] = useState('')
    const [value, setValue] = useState({
        desde: '',
        hasta: ''
    })

    const [textFind, setTextFind] = useState('')

    const createFile = () => {

        const blob = new Blob([textFind], { type: 'text/plain;charset=utf-8' })

        saveAs(blob, 'buscar-en-txt.txt')

    }

    const readFile = (e) => {

        const file = e.target.files[0]

        if(!file) return

        const fileReader = new FileReader()

        fileReader.readAsText(file)

        fileReader.onload = () => {
            console.log(fileReader.result)
            setFileContent(fileReader.result)
        }

        fileReader.onerror = () => {
            console.log(fileReader.error)
            setFileContent('')
        }


    }

    const searchOnFile = () => {

        if (value.desde === '' || value.hasta === '') {
            setTextFind('Los parametros DESDE y/o HASTA son necesrios para buscar, llenelos por favor.')
            return
        }

        if (fileContent === ''){
            setTextFind('archivo seleccionado esta vacio o no se selecciono archivo.')
            return
        }

        const p1 = fileContent.indexOf(value.desde)

        if(p1 === -1) {
            setTextFind('No se encontro una coincidencia con el parametro DESDE.')
            return
        }

        let content = fileContent.slice(p1)

        const p2 = content.indexOf(value.hasta)

        if(p2 === -1) {
            setTextFind('No se encontro una coincidencia con el parametro HASTA.')
            return
        }

        content = content.slice(0, p2)

        setTextFind(content)

    }

    return (
        <div className="min-h-screen w-full bg-slate-800 grid content-center justify-center">
            
            <main className="w-[500px] px-10 text-white mx-auto">
                
                <h1 className="text-2xl text-white mb-4 font-bold">Ingresar texto a buscar: </h1>

                <h3>Desde: </h3>
                <Input
                    value={value.desde}
                    onChange={(e) => setValue({ ...value, desde: e.target.value})}
                />

                <h3>hasta: </h3>
                <Input
                    value={value.hasta}
                    onChange={(e) => setValue({ ...value, hasta: e.target.value})}
                />

                <File onChange={readFile} />

                <section className="flex justify-between gap-2 mt-10">

                    <Button
                        onCLick={searchOnFile}
                    >
                        Buscar en txt
                    </Button>

                    <Button 
                        className="bg-green-500 hover:bg-green-400"
                        onCLick={createFile}
                    >
                        guardar como txt
                    </Button>
                    
                </section>

            </main>

            <section className='max-w-3xl mt-10'>
                <h3 className='text-white'>resultado:</h3>
                <p 
                    className={`
                        mt-2 px-5 max-h-96 overflow-auto
                        ${fileContent === '' || value.desde === '' || value.hasta === '' ? 'text-red-400' : 'text-white/60'}
                    `}
                > 
                    { textFind } 
                </p>
            </section>

        </div>
    )
}
