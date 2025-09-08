<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ProductsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $selectedIds;

    public function __construct($selectedIds = null)
    {
        $this->selectedIds = $selectedIds;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $query = Product::with('category');

        if ($this->selectedIds) {
            $query->whereIn('id', $this->selectedIds);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Category',
            'Description',
            'Price',
            'Stock',
            'Status',
            'Created At',
            'Updated At'
        ];
    }

    public function map($product): array
    {
        return [
            $product->id,
            $product->name,
            $product->category ? $product->category->name : 'No Category',
            $product->description,
            number_format($product->price, 2),
            $product->stock,
            $product->enabled ? 'Enabled' : 'Disabled',
            $product->created_at->format('Y-m-d H:i:s'),
            $product->updated_at->format('Y-m-d H:i:s')
        ];
    }
}
