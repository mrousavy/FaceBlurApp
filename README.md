# Face Blur App

This is an app to demonstrate the use of VisionCamera to build a realtime face blurring application. 😷

https://github.com/mrousavy/FaceBlurApp/assets/15199031/cb2fd119-9dad-4e8a-9a97-579bb2eae888

It took me 25 minutes to build the app, and this runs on both iOS and Android at 60-120 FPS.
I can swap out the drawing algorithm, plug in a different shader, use a different ML model like pose-, object- or hand-detection, and change Camera properties within seconds to minutes - it has never been so easy to build Camera apps, all thanks to [react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera)! 🚀

## How?

FaceBlurApp uses [react-native-vision-camera](https://github.com/mrousavy/react-native-vision-camera) to display a Camera feed.

Using the VisionCamera [Frame Processors](https://react-native-vision-camera.com/docs/guides/frame-processors) API and the [react-native-vision-camera-face-detector](https://github.com/nonam4/react-native-vision-camera-face-detector) Frame Processor plugin, we can detect faces in realtime at 60-120 FPS.

Then, we can draw a blur shader/mask over the detected faces by using the VisionCamera [Skia Frame Processors](https://react-native-vision-camera.com/docs/guides/skia-frame-processors) integration. In this case, a simple blur `RuntimeEffect` from [react-native-skia](https://github.com/shopify/react-native-skia) is used.

This is the relevant code:

```ts
const {detectFaces} = useFaceDetector({
 performanceMode: 'fast',
 contourMode: 'all',
 landmarkMode: 'none',
 classificationMode: 'none',
});

const blurRadius = 25;
const blurFilter = Skia.ImageFilter.MakeBlur(
 blurRadius,
 blurRadius,
 TileMode.Repeat,
 null,
);
const paint = Skia.Paint();
paint.setImageFilter(blurFilter);

const frameProcessor = useSkiaFrameProcessor(frame => {
   'worklet';
   frame.render();
   
   const {faces} = detectFaces({frame: frame});
   
   for (const face of faces) {
      const path = Skia.Path.Make();
      
      const necessaryContours: (keyof Contours)[] = [
         'FACE',
         'LEFT_CHEEK',
         'RIGHT_CHEEK',
      ];
      for (const key of necessaryContours) {
         const points = face.contours[key];
         points.forEach((point, index) => {
            if (index === 0) {
               // it's a starting point
               path.moveTo(point.x, point.y);
            } else {
               // it's a continuation
               path.lineTo(point.x, point.y);
            }
         });
         path.close();
      }
      
      frame.save();
      frame.clipPath(path, ClipOp.Intersect, true);
      frame.render(paint);
      frame.restore();
   }
}, [paint, detectFaces])
```
