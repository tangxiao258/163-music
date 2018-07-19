{
	let view = {
		el: '.playlist-wrapper',
		render(data){
			$(this.el).find('.playlist').remove()
			let liList = data.map((item) => {
				return $(`<li class="playlist">${item.name}</li>`)
			})
			$(this.el).append(liList)
		}
	}

	let model = {
		data:[],
		find(){
			var playlist = new AV.Query('Playlist');
		    return playlist.find().then((playlists) => {
		    	playlists.map((playlist) => {
		    		let {id, attributes} = playlist
		    		let item = {id, ...attributes}
		    		this.data.push(item)
		    	})
		        return playlist
		    });
		}
	}

	let controller = {
		init(view, model){
			this.view = view
			this.model = model
			this.getPlayList()
			this.bindEvents()
			this.bindEventHub()
		},
		bindEvents(){
			$(this.view.el).on('click', 'li', (e) => {
				$(e.currentTarget).addClass('active')
				    .siblings('.active').removeClass('active')
				let isPlaylist = $(e.currentTarget).attr('class').indexOf('playlist') === 0 ? true : false
				if(isPlaylist){
					let index = $(e.currentTarget).index()
					window.eventHub.emit('editAbled', this.model.data[index])
				}else{
					window.eventHub.emit('editDisabled')
				}
			})
		},
		bindEventHub(){
			window.eventHub.on('playlistSearchUpdate', (data) => {
				this.model.data = data
				this.view.render(this.model.data)
			})

			window.eventHub.on('newPlaylist', (data) => {
				this.model.data.push(data)
				this.view.render(this.model.data)
			})
		},
		getPlayList(){
			this.model.find().then((result) => {
				this.view.render(this.model.data)
			})
		}
	}

	controller.init(view, model)
}