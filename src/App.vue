<template>
    <div class="app">
        <input type="text" class="form-control" placeholder="Enter a name to join." v-model="username" @keyup.enter="join">

        <br>

        <section v-if="authData">
            <h2 class="text-center">Your view:</h2>
            <iframe class="viewer" src="/#!/viewer" v-if="authData"></iframe>
        </section>

        <section v-if="!authData">
            <h2 class="text-center" v-if="story.users">Users currently in this story:</h2>
            <h2 class="text-center" v-if="!story.users">No users in this story currently...</h2>
            <div class="watcher-list">
                <div class="card" v-for="user in story.users">
                    <div class="card-block">
                        <h4 class="card-title text-center">{{ user.username }}</h4>
                    </div>
                    <iframe :src="'/#!/watcher/'+$key"> </iframe>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import Firebase from 'firebase';
    export default {
        data() {
                return {
                    username: '',
                    authData: undefined,
                    rotation: ''
                }
            },
            firebase: {
                story: {
                    asObject: true,
                    source: new Firebase('https://vivid-torch-9375.firebaseio.com/algo'),
                }
            },
            methods: {
                join() {
                    this.$firebaseRefs.story.authAnonymously((err, authData) => {
                        this.authData = authData;
                        this.$firebaseRefs.story.child(`users/${authData.uid}`).set({
                            username: this.username
                        }).then(() => {
                            this.$firebaseRefs.story.child(`/users/${authData.uid}`).onDisconnect().remove();
                        });
                    });
                }
            },
            ready() {
                setInterval(() => {
                    if (!this.$els.camera) return;
                    let rotation = this.$els.camera.object3D.rotation;
                    this.$firebaseRefs.story.child(`users/${this.authData.uid}`).update({
                        rotation: `${rotation.x} ${rotation.y} ${rotation.z}`
                    });
                }, 100);
            }
    }
</script>

<style>
    body {
        font-family: Helvetica, sans-serif;
        display: flex;
        justify-content: center;
        margin: 1rem;
    }
    
    * {
        box-sizing: border-box;
    }
    
    iframe {
        border: none;
    }
    
    #app {
        max-width: 48rem;
        width: 100%;
    }
    
    .text-center {
        text-align: center;
    }
    
    .app {
        display: flex;
        flex-flow: column;
    }
    
    .viewer {
        width: 100%;
        height: 30rem;
    }
    
    .watcher-list {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
    }
    
    .watcher-list iframe {
        pointer-events: none;
    }
</style>
