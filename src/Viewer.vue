<template>
    <a-scene>
        <a-camera v-el:camera></a-camera>
        <a-sky :src="story.url"></a-sky>
    </a-scene>
</template>

<script>
    import Firebase from 'firebase';
    require('aframe');

    export default {
        firebase: {
            story: {
                asObject: true,
                source: new Firebase('https://vivid-torch-9375.firebaseio.com/algo')
            }
        },
        computed: {
            auth() {
                return this.$firebaseRefs.story.getAuth();
            }
        },
        ready() {
            setInterval(() => {
                let rotation = this.$els.camera.object3D.rotation;
                this.$firebaseRefs.story.child(`users/${this.auth.uid}`).update({
                    rotation: `${rotation.x} ${rotation.y} ${rotation.z}`
                });
            }, 100);

        }
    };
</script>
