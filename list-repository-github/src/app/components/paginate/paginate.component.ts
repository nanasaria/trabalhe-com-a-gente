import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

@Component({
    selector: 'app-paginate',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './paginate.component.html',
    styleUrl: './paginate.component.css',
})
export class PaginateComponent implements OnChanges {
    @Input() paginate: Array<Record<string, string>> = [];
    currentPage: string = '';

    @Output() eventPage = new EventEmitter<string>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['paginate'] && this.paginate.length > 0) {
            this.calcCurrentPage();
        }
    }

    onChangePage(url: string) {
        this.eventPage.emit(url);
    }

    calcCurrentPage(): string {
        const next = Number(this.paginate[0]?.['next_number']) ?? 0;
        return (this.currentPage = String(next - 1));
    }
}
