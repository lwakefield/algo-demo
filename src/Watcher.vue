<template>
    <a-scene look-controls="enabled: false" vr-mode-ui="enabled: false">
        <a-entity :rotation="rotation">
            <a-camera></a-camera>
        </a-entity>
        <a-sky :src="story.url"></a-sky>
    </a-scene>
</template>

<script>
    import Firebase from 'firebase';

    export default {
        firebase: {
            story: {
                asObject: true,
                source: new Firebase('https://vivid-torch-9375.firebaseio.com/algo')
            }
        },
        computed: {
            rotation() {
                if (!this.story || !this.story.users) return '0 0 0';
                let [x, y, z] = this.user.rotation.split(' ');
                x /= 2 * Math.PI;
                y /= 2 * Math.PI;
                z /= 2 * Math.PI;
                x *= 360;
                y *= 360;
                z *= 360;
                return `${x} ${y} ${z}`;
            }
        },
        created() {
            require('aframe');
        },
        ready() {
            this.$bindAsObject('user', this.$firebaseRefs.story.child(`/users/${this.$route.params.uid}`));
        }
    };
</script>
