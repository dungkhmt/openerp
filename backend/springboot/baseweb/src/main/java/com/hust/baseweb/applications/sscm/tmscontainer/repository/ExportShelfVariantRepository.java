package com.hust.baseweb.applications.sscm.tmscontainer.repository;

import com.hust.baseweb.applications.sscm.tmscontainer.entity.ExportShelfVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExportShelfVariantRepository extends JpaRepository<ExportShelfVariant, Integer> {

    @Query(value="select * from export_shelf_variant where export_line_item_id = ?", nativeQuery=true)
    List<ExportShelfVariant> findByExportLineItemId(Integer exportLineItemId);

    @Query(value="select * from export_shelf_variant where shelf_variant_id = ?1 and export_line_item_id = ?2", nativeQuery=true)
    ExportShelfVariant findByShelfVariantIdAndExportLineItemId(Integer shelfVariantId, Integer exportLineItemId);
}
