$(document).ready(function(){
    $('#loading-image').hide()
    const noOfColumn = 8

    $('#data_table').on("keyup",'.hidden-input', function(){
        let curRow = $(this).closest('tr')
        curRow.removeClass('filled')
        let isFilled = false
        curRow.find('.hidden-input').each(function(){
            if($(this).val()!==""){
                isFilled = true
            }
        })
        if(isFilled){
            curRow.addClass('filled')
        }
        else{
            curRow.removeClass('filled')
        }
    })

    $(document).bind("paste", function(e){
        if(e.target.className == "hidden-input"){
            return
        }
        $('#loading-image').show()
        var pastedData = e.originalEvent.clipboardData.getData('text')
        let rows = pastedData.toString().split('  ')
        rows = rows[0].split('	')
        // console.log(rows)
        if((rows.length-noOfColumn)%(noOfColumn-1) == 0){
            // console.log('valid table...')
            let noOfRows = ((rows.length-noOfColumn)/(noOfColumn-1))+1
            // let headerCon = '<tr>'
            let bodyCon = '<tr class="filled">'
            for(let i=0;i<rows.length;i++){
                if(i>=0 && i<noOfColumn){
                    bodyCon += `<td><input class="hidden-input" value="${rows[i].split(/\r\n|\n|\r/)[0]}"/></td>`
                    if(i==noOfColumn-1 && i+1 != rows.length){
                        bodyCon += `</tr><tr class="filled"><td><input class="hidden-input" value="${rows[i].split(/\r\n|\n|\r/)[1]}"/></td>`
                    }
                }
                else{
                    bodyCon += `<td><input class="hidden-input" value="${rows[i].split(/\r\n|\n|\r/)[0]}"/></td>`
                    if(i%(noOfColumn-1) == 0 && i+1 != rows.length){
                        bodyCon += `</tr><tr class="filled"><td><input class="hidden-input" value="${rows[i].split(/\r\n|\n|\r/)[1]}"/></td>`
                    }
                }
            }
            // headerCon += '</tr>'
            // $('#data_table thead').html(headerCon)
            bodyCon += '</tr>'
            if($('.filled').length>0){
                $('.filled:last').after(bodyCon)

            }
            else{
                $('#data_table tbody').html(bodyCon)
                addNewRow()
            }
        }
        else{
            console.log('Invalid Data...')
        }
        $('#loading-image').hide()
        // rows.each((row) => console.log(row))
    })

    $('#reset').on('click',function(){
        $('#data_table tbody').empty()
        $('#confirm-check').prop('checked',false)
        addNewRow()
    })

    $('#add-row').on('click',function(){
        addNewRow()
    })

    $('#save-info').on('click',function(){
        if(!$('#confirm-check:checked').length){
            alert('please check details & agree the checkbox')
            return
        }
        if($('.filled').length == 0){
            alert('Row is Empty')
            return
        }
        $('#loading-image').show()
        let data = []
        $('tr.filled').each(function(){
            let curRow = $(this)
            data.push({
                sl_no:$(curRow.find('.hidden-input')[0]).val().trim(),
                garden:$(curRow.find('.hidden-input')[1]).val().trim(),
                invoice:$(curRow.find('.hidden-input')[2]).val().trim(),
                grade:$(curRow.find('.hidden-input')[3]).val().trim(),
                pkgs:$(curRow.find('.hidden-input')[4]).val().trim(),
                kgs:$(curRow.find('.hidden-input')[5]).val().trim(),
                price_india:$(curRow.find('.hidden-input')[6]).val().trim(),
                comment:$(curRow.find('.hidden-input')[7]).val().trim(),
            })
        })
        $.ajax({
            type:'post',
            url:'insert-data',
            data:{data}
        }).done(function(res){
            console.log(res)
            alert('Your Data Saved in DB')
            $('#data_table tbody').empty()
            $('#loading-image').hide()
            $('#confirm-check').props('checked',false)
            addNewRow()
        }).catch(function(err){
            console.log(err)
            $('#loading-image').hide()
        })
    })

})

function addNewRow(){
    let htmlCon = `<tr>
        <td><input class="hidden-input"/></td>
        <td><input class="hidden-input"/></td>
        <td><input class="hidden-input"/></td>
        <td><input class="hidden-input"/></td>
        <td><input class="hidden-input"/></td>
        <td><input class="hidden-input"/></td>
        <td><input class="hidden-input"/></td>
        <td><input class="hidden-input"/></td>
    </tr>`
    $('#data_table tbody').append(htmlCon)
}
