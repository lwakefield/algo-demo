<template>
    <div class="app">
        <div class="input-group">
            <input type="text" class="form-control" placeholder="Enter a name to join." v-model="username" @keyup.enter="join">
            <span class="input-group-btn">
                <button class="btn btn-primary" type="button" @click="join">Join!</button>
            </span>
        </div>

        <br>

        <section v-if="authData">
            <header class="viewer-header">
                <h2>Your view:</h2>
                <button class="btn btn-primary" @click="fullscreen">fullscreen</button>
            </header>
            <iframe class="viewer" src="/#!/viewer" v-if="authData" v-el:view></iframe>
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
                },
                fullscreen() {
                    let view = this.$els.view;
                    if (view.requestFullscreen) {
                        view.requestFullscreen();
                    } else if (view.webkitRequestFullscreen) {
                        view.webkitRequestFullscreen();
                    } else if (view.mozRequestFullScreen) {
                        view.mozRequestFullScreen();
                    } else if (view.msRequestFullscreen) {
                        view.msRequestFullscreen();
                    }
                }
            },
            ready() {
                window.onbeforeunload = () => {
                    if (this.authData) this.$firebaseRefs.story.child(`/users/${authData.uid}`).remove();
                };
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
    
    .viewer-header {
        display: flex;
        justify-content: space-between;
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
