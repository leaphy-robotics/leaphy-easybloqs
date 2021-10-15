import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useBlocklyWorkspace } from 'leaphy-react-blockly';
import { useRef, useState, useEffect } from 'react'
import categories from '../../toolboxes/categories';
import Blockly from "leaphy-blockly";
import "leaphy-blockly/arduino"
import Button from '@material-ui/core/Button';
import styles from '../../styles/Editor.module.css'

const initialXml =
    `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="leaphy_start" id="rzE0Ve:6bHB~8aIqyj-U" deletable="false" x="500" y="10"/>
</xml>`;

const Robot: NextPage = () => {
    const router = useRouter()
    const { robot } = router.query
    const onWorkspaceChange = (workspace: any) => {
        const updatedCode = Blockly.Arduino.workspaceToCode(workspace);
        setCode(updatedCode);
    };

    const [code, setCode] = useState<string>('');
    const [isUploadClicked, setIsUploadClicked] = useState<boolean>(false);

    const onUploadClicked = () => {
        setIsUploadClicked(true);
    }

    useEffect(() => {

        if (!isUploadClicked) return;

        const compile = async (): Promise<Blob> => {
            console.log('gonna compile da codez');

            const payload = {
                sketch: code
            }

            const request: RequestInit = {
                method: "POST",
                body: JSON.stringify(payload),
                mode: "cors",
                redirect: "follow",
                headers: {
                    "content-type": "application/json" 
                }
            }

            let compileResponse;
            try{
                compileResponse = await fetch("https://c0lz7poj8g.execute-api.eu-west-1.amazonaws.com", request);
            } catch(err){
                throw new Error("Something went wrong");
            }
            
            const responseJson = await compileResponse.json();
            console.log(responseJson);
            const binaryFetchResponse = await fetch(responseJson.binaryLocation);
            return await binaryFetchResponse.blob();
        }

        const flashBoard = (blob: Blob) => {
            console.log('Totally flashing this board man');

            const reader = new FileReader();
            reader.readAsArrayBuffer(blob);

            reader.onload = async event => {
                if (!event || !event.target) {
                    console.log('Error loading info from file! Aborting');
                    return;
                };

                const filecontents = event.target.result;

                const AvrgirlArduino = require("../../libs/avrgirl-arduino.min.js")

                const avrgirl = new AvrgirlArduino({
                    board: 'uno',
                    debug: true
                });

                avrgirl.flash(filecontents, (error: any) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.info("flash successful");
                    }
                });
            };
        }

        compile().then(blob => flashBoard(blob));

        setIsUploadClicked(false);

    }, [isUploadClicked, code])



    const blocklyRef = useRef(null);
    useBlocklyWorkspace({
        ref: blocklyRef,
        toolboxConfiguration: categories,
        initialXml: initialXml,
        className: "fill-height",
        onWorkspaceChange: onWorkspaceChange
    });
    return (
        
        <div className={styles.blocklyContainer}>
            <div ref={blocklyRef} className={styles.blocklyView} />
            <div className={styles.codeView}>
                <div><Button onClick={onUploadClicked} color="inherit">Upload</Button></div>
                <div>{code}</div>
            </div>
        </div>
    )
}

export default Robot
