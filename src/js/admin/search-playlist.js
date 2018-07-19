{
	let view = {
		el: '#searchPlaylist'
	}

	let model = {
		data:[],
		find(key){
			var playlist = new AV.Query('Playlist');
			playlist.startsWith('name', key);
			return playlist.find().then((playlists) => {
                this.data = playlists.map((playlist) => {
                	let {id, attributes} = playlist
                	let item = {id, ...attributes}
                	return item
                })
                return playlist
            });
		}
	}

	let controller = {
		init(view, model){
			this.view = view
			this.model = model
			this.bindEvents()
		},
		bindEvents(){
			$(this.view.el).on('change', (e) => {
				let key = $(e.currentTarget).val()
				this.model.find(key).then((result) => {
					window.eventHub.emit('playlistSearchUpdate', this.model.data)
				})
			})
		}
	}

	controller.init(view, model)
}