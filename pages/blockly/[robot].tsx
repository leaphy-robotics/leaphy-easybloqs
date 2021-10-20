import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { useBlocklyWorkspace } from 'leaphy-react-blockly';
import { useRef, useState, useEffect } from 'react'
import Blockly from "leaphy-blockly";
import "leaphy-blockly/arduino"
import styles from '../../styles/Robot.module.css'

import { origToolbox, flitzToolbox, clickToolbox } from '../../toolboxes/toolboxes'
import Header from '../../components/header/header';


const initialXml =
    `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="leaphy_start" id="rzE0Ve:6bHB~8aIqyj-U" deletable="false" x="500" y="10"/>
</xml>`;

const Robot: NextPage = () => {
    const router = useRouter()
    const { robot } = router.query

    const selectToolbox = (robot: string) => {
        switch (robot) {
            case 'orig':
                return origToolbox;
            case 'flitz':
                return flitzToolbox;
            case 'click':
                return clickToolbox;
            default:
                break;
        }
    }

    const toolbox = selectToolbox(robot as string);

    const [code, setCode] = useState<string>('');
    const [isUploadClicked, setIsUploadClicked] = useState<boolean>(false);

    useEffect(() => {

        if (!isUploadClicked) return;

        const connectToBoard = async (): Promise<boolean> => {

            const AvrgirlArduino = require("../../libs/avrgirl-arduino.min.js")

            const avrgirl = new AvrgirlArduino({
                board: 'uno',
                debug: true
            });

            const promise = new Promise<any>((resolve, reject) => {
                avrgirl.connection._init((err: any) => {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    avrgirl.connection._pollForOpen((err: any) => {
                        if (err) {
                            console.error(err);
                            return reject(err);
                        }
                        resolve(avrgirl);
                    });
                });
            })

            return promise;
        }

        const compile = async (): Promise<Blob> => {
            console.log('Starting Cloud Compilation');

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
            try {
                compileResponse = await fetch("https://c0lz7poj8g.execute-api.eu-west-1.amazonaws.com", request);
            } catch (err) {
                throw new Error("Something went wrong");
            }

            const responseJson = await compileResponse.json();
            console.log(responseJson);
            const binaryFetchResponse = await fetch(responseJson.binaryLocation);
            return await binaryFetchResponse.blob();
        }

        const flashBoard = (blob: Blob, avrgirl: any) => {
            console.log('Starting Board Flash');

            const reader = new FileReader();
            reader.readAsArrayBuffer(blob);

            reader.onload = async event => {
                if (!event || !event.target) {
                    console.log('Error loading info from file! Aborting');
                    return;
                };

                const fileContents = event.target.result;

                avrgirl.flash(fileContents, (error: any) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.info("flash successful");
                    }
                });
            };
        }

        Promise.all([connectToBoard(), compile()]).then(([avrgirl, hexFileBlob]) => {
            if (avrgirl) flashBoard(hexFileBlob, avrgirl);
        })

        setIsUploadClicked(false);

    }, [isUploadClicked, code])

    const blocklyRef = useRef(null);

    const onWorkspaceChange = (workspace: any) => {
        const updatedCode = Blockly.Arduino.workspaceToCode(workspace);
        setCode(updatedCode);
    };

    useBlocklyWorkspace({
        ref: blocklyRef,
        toolboxConfiguration: toolbox,
        workspaceConfiguration: {
            scrollbars: true,
            zoom: {
                controls: true,
                wheel: false,
                startScale: 0.8,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2,
            },
            trashcan: true,
            move: {
                scrollbars: true,
                drag: true,
                wheel: true,
            },
            renderer: "zelos",
        },
        initialXml: initialXml,
        className: "fill-height",
        onWorkspaceChange: onWorkspaceChange
    });

    const onUploadClicked = () => {
        setIsUploadClicked(true);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Leaphy Easybloqs</title>
                <meta name="description" content="Program Leaphy Robots!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Header onUploadClicked={onUploadClicked}></Header>
                <div className={styles.blocklyContainer}>
                    <div ref={blocklyRef} className={styles.blocklyView} />
                </div>
            </main>

        </div>
    )
}

export default Robot
