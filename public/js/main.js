$(document).ready(() => {
    $('.delete-article').on('click', (e) => {
        console.log(e.target);
        $target = $(e.target);
        const id = $target.attr('data-id');

        if(confirm('Are you sure you want to delete this article?')) {
            $.ajax({
                type: 'DELETE',
                url: '/articles/'+id,
                success: (response) => {
                    window.location.href='/';
                },
                error: (err) => {
                    console.log(err);
                }
            });
        }
    });
});
