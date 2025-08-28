import { useState, useCallback, useRef, FC } from 'react'
import Cropper from 'react-easy-crop'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { UploadIcon, RotateCcwIcon, CheckIcon, XIcon, ZoomInIcon, ZoomOutIcon, CameraIcon, AlertCircleIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'
import exifr from 'exifr'

// Add Telegram WebApp type declaration
declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                platform: string;
            };
        };
    }
}

interface CropArea {
    x: number
    y: number
    width: number
    height: number
}

interface ImageEditorProps {
    onImageSave: (croppedImage: string, exif: any) => void
    onClose?: () => void
    maxFileSize?: number // in MB
}

export const ImageEditor: FC<ImageEditorProps> = ({
    onImageSave,
    onClose,
    maxFileSize = 10
}) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | React.ReactNode | null>(null)
    const { translations: { globalDict } } = useLanguage();
    const { tgWebAppPlatform } = retrieveLaunchParams();
    const [originalFile, setOriginalFile] = useState<File | null>(null)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)

    // Handle file drop/upload
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
            setError(globalDict.fileSizeMustBeLessThan(maxFileSize));
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError(globalDict.pleaseUploadImageFile);
            return
        }

        setError(null)
        setOriginalFile(file)
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            setImageSrc(reader.result as string)
        })
        reader.readAsDataURL(file)
    }, [maxFileSize])

    // Handle camera capture
    const handleCameraCapture = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
            setError(globalDict.fileSizeMustBeLessThan(maxFileSize));
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError(globalDict.pleaseUploadImageFile);
            return
        }

        setError(null)
        setOriginalFile(file)
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            setImageSrc(reader.result as string)
        })
        reader.readAsDataURL(file)

        // Reset the input value so the same file can be selected again
        event.target.value = ''
    }, [maxFileSize])

    const handleCameraClick = () => {
        cameraInputRef.current?.click()
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        multiple: false,
        maxSize: maxFileSize * 1024 * 1024
    })

    // Handle crop completion
    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: CropArea) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    // Create cropped image
    const createCroppedImage = useCallback(async (): Promise<string> => {
        if (!imageSrc || !croppedAreaPixels) return ''

        const canvas = canvasRef.current
        if (!canvas) return ''

        const ctx = canvas.getContext('2d')
        if (!ctx) return ''

        return new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = () => {
                // Set canvas size to the desired output size (720x960)
                canvas.width = 720
                canvas.height = 960

                // Calculate scaling to fit the crop area into 720x960
                // const scaleX = 720 / croppedAreaPixels.width
                // const scaleY = 960 / croppedAreaPixels.height

                // Draw the cropped image onto the canvas
                ctx.drawImage(
                    image,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0,
                    720,
                    960
                )

                // Convert to base64
                const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.8)
                resolve(croppedImageUrl)
            }
            image.onerror = reject
            image.src = imageSrc
        })
    }, [imageSrc, croppedAreaPixels])

    // Save cropped image
    const handleSave = async () => {
        if (!croppedAreaPixels) return

        setIsProcessing(true)
        try {
            const croppedImage = await createCroppedImage()
            let exif = null
            if (originalFile) {
                try {
                    // Convert File to ArrayBuffer for exifr to properly read EXIF data
                    const arrayBuffer = await originalFile.arrayBuffer()
                    // Try to parse all available metadata
                    exif = await exifr.parse(arrayBuffer, {
                        tiff: true,
                        xmp: true,
                        icc: true,
                        iptc: true,
                        jfif: true,
                        ihdr: true
                    })
                    // If no metadata found, try basic parsing
                    if (!exif) {
                        exif = await exifr.parse(arrayBuffer)
                    }
                } catch (ex) {
                    exif = null
                }
            }

            // Remove exif records where key is numeric string (custom fields) and value is "0" (no value)
            if (exif) {
              const exifExcludedKeys = ["59932", "Padding"];
              exif = Object.fromEntries(
                Object.entries(exif).filter(([key, value]) => (
                  (!(/^\d+$/.test(key)) || value !== 0) && // Keep non-numeric keys or numeric keys with non-zero values
                  !exifExcludedKeys.includes(key) // Drop specific keys
                ))
              );
            }

            onImageSave(croppedImage, exif)
        } catch (error) {
            setError(globalDict.failedToProcessImage);
        } finally {
            setIsProcessing(false)
            if (onClose) {
                onClose()
            }
        }
    }

    // Reset to upload state
    const handleReset = () => {
        setImageSrc(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedAreaPixels(null)
        setError(null)
        setOriginalFile(null)
    }

    // Zoom controls
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3))
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 1))

    if (!imageSrc) {
        return (
            <div className="h-full flex flex-col justify-end pb-8 pt-12 px-8">
                <div className="h-full flex flex-col justify-start gap-4">
                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors
                            ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <input {...getInputProps()} />
                        <UploadIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 mb-4">
                            {isDragActive ? globalDict.dropImageHere : globalDict.dragAndDropImage}
                        </p>
                        <p className="text-xs text-gray-400">
                            {globalDict.supportedImageFormats(maxFileSize)}
                        </p>
                    </div>

                    {(tgWebAppPlatform === 'ios') && (
                        <>
                            <div
                                onClick={handleCameraClick}
                                className="border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors border-gray-300 hover:border-gray-400"
                            >
                                <CameraIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500 mb-4">
                                    {globalDict.clickToTakePhoto}
                                </p>
                            </div>

                            <input
                                ref={cameraInputRef}
                                type="file"
                                accept="image/*"
                                capture="user"
                                onChange={handleCameraCapture}
                                style={{ display: 'none' }}
                            />
                        </>
                    )}
                </div>
                <div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>{globalDict.errorUploadingImage}</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <div className="p-4">
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Edit Photo</h3>
                    <p className="text-sm text-gray-500">
                        {globalDict.adjustCropArea}
                    </p>
                </div>

                {/* Cropper Container */}
                <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={3 / 4}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        showGrid={true}
                        cropShape="rect"
                    />
                </div>

                {/* Zoom Controls */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{globalDict.zoom}</span>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleZoomOut}
                                disabled={zoom <= 1}
                            >
                                <ZoomOutIcon className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleZoomIn}
                                disabled={zoom >= 3}
                            >
                                <ZoomInIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <Slider
                        value={[zoom]}
                        onValueChange={(value) => setZoom(value[0])}
                        min={1}
                        max={3}
                        step={0.1}
                        className="w-full"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1"
                    >
                        <RotateCcwIcon className="w-4 h-4 mr-2" />
                        {globalDict.reset}
                    </Button>

                    {onClose && (
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            <XIcon className="w-4 h-4 mr-2" />
                            {globalDict.cancel}
                        </Button>
                    )}

                    <Button
                        onClick={handleSave}
                        disabled={!croppedAreaPixels || isProcessing}
                        className="flex-1"
                    >
                        <CheckIcon className="w-4 h-4 mr-2" />
                        {isProcessing ? globalDict.processing : globalDict.save}
                    </Button>
                </div>
            </div>

            {/* Hidden canvas for image processing */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Card>
    )
}
